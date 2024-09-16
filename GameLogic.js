Math.randomInt = function (Max = 100000) {
    return Math.floor(Math.random() * Max);
}
Array.prototype.removeElementFromArray = function (element)
{
    let index = this.indexOf(element);
    if (index > -1)
        this.splice(index, 1);
    return;
}
function Restart(GameWindow,Count) {
    GameWindow.style.animation = 'MenuEnd 0.8s alternate 1';
    GameWindow.style.animationPlayState = 'running';
    setTimeout(() => { GameWindow.remove(); Game(Count); }, 800);
}

let Game = function (Count, AiMemoryMaxSize = Count * 2) {
    //Notify the player about turns.
    

    let InteractiveDIV = document.createElement('div');
    let AiInfoDIV = document.createElement('div');
    let InfoDIV = document.createElement('div');
    let IDCounter = 0,AiPairCounter = 0, PairCounter = 0;
    InfoDIV.textContent = 0;
    AiInfoDIV.textContent = 0;

    let  AIFirstRow = document.createElement('div');
    let AISecondRow = document.createElement('div');
    let    FirstRow = document.createElement('div');
    let   SecondRow = document.createElement('div');

    let GameWindow = document.body.appendChild(document.createElement('div'));
    GameWindow.style.overflow = "hidden";
    GameWindow.append(AiInfoDIV);
    GameWindow.append(InteractiveDIV);
    GameWindow.append(InfoDIV);
    GameWindow.className = "Game";

    let playerTurn = Math.randomInt(2);
    let RevealedCards = new Array();
    let AiMemory = new Array();
    let Rows = [AIFirstRow, AISecondRow, FirstRow, SecondRow];

    //FirstTurn
    setTimeout(TurnNotification, 400 * 5 + 100);
    ///
    ///
    ///Debug Revealed Cards array
    //let Prekol = document.body.appendChild(document.createElement('div'));
    //setInterval(() => { Prekol.textContent = "DEBUG IDs " + RevealedCards[0]+RevealedCards[1]}, 100);
    ///
    ///
    ///
    let Validator =
    {
        type: Math.randomInt(3),
        variants: [[1, 2, 2], [2, 1, 2], [2, 2, 1]],
        Calculate: function()
            {
            Validator.PairsRatio = Validator.variants[Validator.type],
            Validator.MaxRed = Validator.PairsRatio[0] * 2 * Count,
            Validator.MaxYellow = Validator.PairsRatio[1] * 2 * Count,
            Validator.MaxGreen  = Validator.PairsRatio[2] * 2 * Count
            } 
    }
    Validator.Calculate();
    let Counters = [Number(Validator.MaxGreen), Number(Validator.MaxYellow), Number(Validator.MaxRed)];

    for (let i = 0; i < 4; i++)
    {
        Rows[i].setAttribute('align', 'center');
        Rows[i].className = (i > 1) ? "PlayerRow" : "AIRow";
        setTimeout(() => {
            for (let j = 0; j < Count * 5; j++)
            {
                setTimeout(() =>
                {
                    if (i == 2 && j == 0) Counters = [Number(Validator.MaxGreen), Number(Validator.MaxYellow), Number(Validator.MaxRed)];
                    
                    let CardType = Math.floor(Math.random() * 3);
                    while(Counters[CardType]<=0)
                    CardType = Math.floor(Math.random() * 3);
                    Counters[CardType] -= 1;

                    let IMGNode = Rows[i].appendChild(document.createElement('img'));
                    IMGNode.className = 'closed';
                    IMGNode.setAttribute("CardType", CardType);
                    IMGNode.id = IDCounter++;
                    IMGNode.src = 'Content\\Units\\TurretT4_Field.png';

                    if (i > 1) IMGNode.addEventListener('click', IMGClick);
                }, 15 * (i + j + 1));
            }
            InteractiveDIV.append(Rows[i]);
        }, 400 * (i + 1));

    }
/*    function TestPlayer() 
    {
        let y = setInterval(() => {
            if (!playerTurn) { clearInterval(y); return; }
            let list = Array.from(Rows[2].getElementsByClassName('closed')).concat(Array.from(Rows[3].getElementsByClassName('closed')));
            if (list.length == 0) { clearInterval(y); GameOver(); return; }
            let one = Math.randomInt(list.length);
            IMGClick(list[one]);
            if (list.length == 1) { clearInterval(y); GameOver("broke the game!"); return; }
            let two;
            do {
                two = Math.randomInt(list.length);
            } while (two == one);
            IMGClick(list[two], true);
        }, 410);
    }*/
    function TurnNotification() {
        let Notification = InteractiveDIV.appendChild(document.createElement('div'));
        Notification.className = 'closed';
        Notification.setAttribute('align', 'center');
        Notification.style.animation = 'GreenNotification 0.5s alternate 1';
        Notification.style.animationPlayState = 'running';
        let text = ((playerTurn) ? "Your " : "Enemy ") + "turn";
        Notification.classList.add((playerTurn) ? "PlayerTurn" : "EnemyTurn");
        for (let i = 0; i < text.length; i++) {
            setTimeout(() => { Notification.textContent += text[i]; }, 100 * (i + 1));
            setTimeout(() => { Notification.textContent = Notification.textContent.replace(/.$/, ''); }, 130 * (text.length + i + 1));
        }
        setTimeout(() => { Notification.remove(); if (!playerTurn) EnemyTurn(); }, 130 * (text.length * 2 + 1));
    }
    function EnemyTurn() {
        let y = setInterval(() => {
            if (playerTurn) { clearInterval(y); return; }
            let list = Array.from(Rows[0].getElementsByClassName('closed')).concat(Array.from(Rows[1].getElementsByClassName('closed')));
            if (list.length == 0) { clearInterval(y); GameOver(); return; }

            let one = Math.randomInt(list.length);
            AiMemory.removeElementFromArray(list[one]);
            IMGClick(list[one]);
            ///
            if (list.length == 1)
            { clearInterval(y); GameOver("broke the game! If you are seeing this ingame, then something bad happened."); return; }
            ///
            let two;
            do
            {
                two = Math.randomInt(list.length);
            } while (two == one);

            for (let i = 0; i < AiMemory.length; i++)
            {
                if (list[two] === AiMemory[i]) AiMemory.removeElementFromArray(AiMemory[i])
                else
                if ((AiMemory[i].getAttribute("CardType") == list[one].getAttribute("CardType")))
                {
                    IMGClick(AiMemory[i],true); return;
                }
            }
            
            IMGClick(list[two], true);
        }, 410);
    }

    function CheckSelectedIMG(AI = false) {
        let Array = RevealedCards;
        if (Array[0].getAttribute("CardType") == Array[1].getAttribute("CardType")) {
            if (!AI) setTimeout(() =>
            { Array[1].remove(); Array[0].remove(); RevealedCards.splice(0, 2); }, 410);
            Array[0].style.width = '0%';
            Array[1].style.width = '0%';
            if (playerTurn)
            {
                InfoDIV.textContent = ++PairCounter + ((PairCounter>1)? " pairs" : " pair");
                if (PairCounter == Count * 5) GameOver();
                return 1;
            }
            else {
                for (let i = 0; i < 2; i++)
                 AiMemory.removeElementFromArray(Array[i]);
                
                AiInfoDIV.textContent = ++AiPairCounter + ((AiPairCounter>1)?" pairs":" pair");
                return 2;
            }
        }
        if (!playerTurn)
        {
            AiMemory.unshift(Array[0], Array[1]);
            if (AiMemory.length > AiMemoryMaxSize)
                AiMemory.splice(AiMemoryMaxSize-1);
        } 
        HideBack(Array[0]);
        HideBack(Array[1]);
        playerTurn = !playerTurn;
        RevealedCards.splice(0, 2);
        TurnNotification();
        return -1;
    }
    function IMGClick(event, AI = false) {
        let image = event;    //Раскрыл противник  

        if (event.target != undefined)  //Раскрыл игрок
        {
            image = event.target;
            if (!playerTurn) return;
        }

        if (RevealedCards.length >= 2) return; //Запретить раскрытие последующих элементов, если уже есть пара
        RevealedCards.push(image);
        image.style = 'animation:SetOut 0.4s alternate 1';
        image.style.animationPlayState = 'running';
        image.removeEventListener('click', IMGClick);
        setTimeout(() => {
            image.removeAttribute("style");
            switch (image.getAttribute("CardType")) {
                case '0':
                    image.src = 'Content\\Units\\TurretT1_Field.png'; break;
                case '1':
                    image.src = 'Content\\Units\\TurretT2_Field.png'; break;
                case '2':
                    image.src = 'Content\\Units\\TurretT3_Field.png'; //break;
            }
            image.className = 'Reveal';
            if (AI) return;
            if (RevealedCards.length == 2)
                setTimeout(CheckSelectedIMG, 400, AI);
        }, 400);
    }

    function HideBack(image) {
        image.style = 'animation:SetOut 0.4s alternate 1';
        image.style.animationPlayState = 'running';
        if (playerTurn) image.addEventListener('click', IMGClick);
        setTimeout(() => {
            image.style = "animation:SetIn 0.4s alternate 1";
            image.src = 'Content\\Units\\TurretT4_Field.png';
            image.className = 'closed';
        }, 350);
    }

    function GameOver(Message="won!")
    {
        let Notification = document.createElement('div');
        Notification.className = 'closed';
        Notification.style.animation = 'GreenNotification 0.5s alternate 1';
        Notification.style.animationPlayState = 'running';
        Notification.classList.add('GameOver');
        Notification.setAttribute('align', 'center');
        InteractiveDIV.append(Notification);
        let text = ((playerTurn) ? "You " : "Enemy ") + Message;
        for (let i = 0; i < text.length; i++) {
            setTimeout(() => { Notification.textContent += text[i]; }, 100 * (i + 1));
        }
        let ReturnButton = GameWindow.appendChild(document.createElement('button'));
        ReturnButton.textContent = "Выйти в меню";
        ReturnButton.addEventListener('click', () => {
            GameWindow.style.animation = 'MenuEnd 0.8s alternate 1';
            GameWindow.style.animationPlayState = 'running';
            setTimeout(() => { GameWindow.remove(); window.onload(); }, 800);
        }, { once: true });
        let RestartButton = GameWindow.appendChild(document.createElement('button'));
        RestartButton.textContent = "Заново";
        RestartButton.addEventListener('click', () => {
            Restart(GameWindow, Count);
        }, { once: true });
        
    }
    function Keys(event)
    {
        
        if (event.key == 'r')
            Restart(GameWindow,Count);
    }
    /*function KeysSPrekolami(event) {
        if (event.key == 'b') {
            console.log("call");
            TestPlayer(); return;
        }
}*/
    document.addEventListener('keydown', Keys, { once: true });
  //  document.addEventListener('keydown', KeysSPrekolami,);

};
