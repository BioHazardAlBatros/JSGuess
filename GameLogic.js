Math.randomInt = function (Max = 100000) {
    return Math.floor(Math.random() * Max);
}
//AI Cheats somehow. 
let Game = function (Count, AiMemoryMaxSize = 0) {
    const InteractiveDIV = document.createElement('div');
    const AiInfoDIV = document.createElement('div');
    const InfoDIV = document.createElement('div');
    let AiCounter = 0, Counter = 0;
    InfoDIV.textContent = 0;
    AiInfoDIV.textContent = 0;


    const AIFirstRow = document.createElement('div');
    const AISecondRow = document.createElement('div');
    const FirstRow = document.createElement('div');
    const SecondRow = document.createElement('div');

    document.body.append(AiInfoDIV);
    document.body.append(InteractiveDIV);
    document.body.append(InfoDIV);

    let playerTurn = Math.randomInt(2);
    let RevealedCards = new Array();
    let AiMemory = new Array();
    let Rows = new Array(4); Rows = [AIFirstRow, AISecondRow, FirstRow, SecondRow];


    function SwitchControl() {
        let Notification = document.createElement('div');
        Notification.className = 'wololo';
        Notification.setAttribute('align', 'center');
        InteractiveDIV.append(Notification);
        let text = ((playerTurn) ? "Your " : "Enemy ") + "turn";
        for (let i = 0; i < text.length; i++) {
            setTimeout(() => { Notification.textContent += text[i]; }, 100 * (i + 1));
            setTimeout(() => { Notification.textContent = Notification.textContent.replace(/.$/, ''); }, 130 * (text.length + i + 1));
        }
        setTimeout(() => { Notification.remove(); if (!playerTurn) EnemyTurn(); }, 130 * (text.length * 2 + 1));
    }
    setTimeout(SwitchControl, 400 * 5 + 100);

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
            for (let j = 0; j < Count * 5; j++) {
                setTimeout(() => {
                    if (i == 2 && j==0) Counters = [Number(Validator.MaxGreen), Number(Validator.MaxYellow), Number(Validator.MaxRed)];
                    let TestIMG = document.createElement('img');
                    TestIMG.className = 'wololo';
                    let CardType = Math.floor(Math.random() * 3);
                    while(Counters[CardType]<=0)
                    { CardType = Math.floor(Math.random() * 3); }
                    Counters[CardType] -= 1;
                    TestIMG.setAttribute("CardType", CardType);
                    TestIMG.src = 'Content\\Units\\TurretT4_Field.png';
                    if(i > 1) TestIMG.addEventListener('click', IMGClick);
                    Rows[i].append(TestIMG);
                }, 15 * (i + j + 1));
            }
            InteractiveDIV.append(Rows[i]);
        }, 400 * (i + 1));

    }

    function EnemyTurn() {
        let y = setInterval(() => {
            if (playerTurn) { clearInterval(y); return; }
            let list = Array.from(Rows[0].getElementsByClassName('wololo')).concat(Array.from(Rows[1].getElementsByClassName('wololo')));
            if (list.length == 0) { clearInterval(y); GameOver(); return; }
            let one = Math.randomInt(list.length);
            IMGClick(list[one]);
           // console.log(AiMemory,' ',list[one]);
            for (let i = 0; i < AiMemory.length; i++)
            {
                if (AiMemory[i].getAttribute("CardType") == list[one].getAttribute("CardType"))
                {
                    IMGClick(AiMemory[i],true); return;
                }
            }
            let two;
            do {
                two = Math.randomInt(list.length);
            } while (two == one);
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
                InfoDIV.textContent = ++Counter;
                if (Counter == Count * 5) GameOver();
                return 1;
            }
            else {
                for (let i = 0; i < 2; i++)
                {
                    let index = AiMemory.indexOf(Array[i]);
                    if (index > -1)
                        AiMemory.splice(index, 1);
                }
                AiInfoDIV.textContent = ++AiCounter;
                return 2;
            }
        }
        if (!playerTurn)
        {
            //console.log(AiMemory);
            AiMemory.push(Array[0], Array[1]);
            if (AiMemory.length > AiMemoryMaxSize)
                AiMemory.splice(AiMemoryMaxSize);
        } 
        HideBack(Array[0]);
        HideBack(Array[1]);
        playerTurn = !playerTurn;
        RevealedCards.splice(0, 2);
        SwitchControl();
        return -1;
    }
    function IMGClick(event, AI = false) {
        //  console.log(RevealedCards);    
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
            image.className = 'wololo';
//            setTimeout(() => { image.removeAttribute("style"); },340);
        }, 350);
    }

    function GameOver()
    {
        let Notification = document.createElement('div');
        Notification.className = 'wololo';
        Notification.setAttribute('align', 'center');
        InteractiveDIV.append(Notification);
        let text = ((playerTurn) ? "You " : "Enemy ") + "won!";
        for (let i = 0; i < text.length; i++) {
            setTimeout(() => { Notification.textContent += text[i]; }, 100 * (i + 1));
        }
    }
    //наборы клавиш
    //let List=new Array();
    function Keys(event) { if (!playerTurn && event.key == 'l') EnemyTurn(); }
    document.addEventListener('keyup', Keys);

   // document.body.innerHTML = '';
    //Game = null;
};
