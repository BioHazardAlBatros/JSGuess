Math.randomInt = function (Max = 100000) {
    return Math.floor(Math.random() * Max);
}

let Game = function(Count,AiMemorySize=3)
{
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
 //   let AiMemory = new Array(AiMemorySize);
    let Rows = new Array(4); Rows = [AIFirstRow, AISecondRow, FirstRow, SecondRow];

    function SwitchControl()
    {
        let paragraph = document.createElement('p');
        paragraph.className = 'wololo';
        paragraph.setAttribute('align', 'center');
        InteractiveDIV.append(paragraph);
        //           let boring = document.createElement('a');
        //           boring.setAttribute('href', 'https://www.youtube.com/watch?v=AzbfKF6jq1s');
        //           paragraph.append(boring);
        let text = ((playerTurn) ? "Your " : "Enemy ") + "turn";
        for (let i = 0; i < text.length; i++) {
            //               setTimeout(() => { boring.textContent += mmmmmmm[i]; }, 100 * (i + 1));
            //               setTimeout(() => { boring.textContent = boring.textContent.replace(/.$/, ''); }, 200 * (mmmmmmm.length + i + 1));
            setTimeout(() => { paragraph.textContent += text[i]; }, 100 * (i + 1));
            setTimeout(() => { paragraph.textContent = paragraph.textContent.replace(/.$/, ''); }, 200 * (text.length + i + 1));
        }
        setTimeout(() => { paragraph.remove(); if (!playerTurn) Test(); }, 200 * (text.length * 2 + 1));
    }
    setTimeout(SwitchControl, 400 * 5 + 100);
    for (let i = 0; i < 4; i++) {
        Rows[i].setAttribute('align', 'center');
        //Rows[i].className = "test";
        Rows[i].className = (i > 1) ? "PlayerRow" : "AIRow";
        setTimeout(() => {
            for (let j = 0; j < Count*5; j++) {
                setTimeout(() => {
                    let TestIMG = document.createElement('img');
                    TestIMG.className = 'wololo';
                    TestIMG.id = Math.floor(Math.random() * 3);
                    TestIMG.src = 'Content\\Units\\TurretT4_Field.png';
                    //if (i > 1) console.log(Rows[i]);
                    (i > 1) ? TestIMG.addEventListener('click', IMGClick) : undefined;
                    Rows[i].append(TestIMG);
                }, 15 * (i + j + 1));
            }
            InteractiveDIV.append(Rows[i]);
            /*setTimeout(() => {
                Rows[i%2].style = "background: radial-gradient(circle farthest-side, red 40%, rgba(240, 248, 255, 0.8) 100%);"
    ; }, 400);*/         //setTimeout(() => { Rows[i].className= (i > 1) ? "PlayerRow" : "AIRow"; }, 400);
        }, 400 * (i + 1));

    }

    function Test()
    {
        let y = setInterval(() =>
        {
            if (playerTurn) { clearInterval(y); return; }
            let list = Array.from(Rows[0].getElementsByClassName('wololo')).concat(Array.from(Rows[1].getElementsByClassName('wololo')));
            let one = Math.randomInt(list.length);
            IMGClick(list[one]);
            let two;
            do {
                two = Math.randomInt(list.length);
            } while (two == one);
            IMGClick(list[two], true);
        },410);
    }

    function CheckSelectedIMG(AI=false) {
        let Array = RevealedCards;
        if (Array[0].id == Array[1].id) {
            if (!AI) setTimeout(() => { Array[1].remove(); Array[0].remove(); RevealedCards.splice(0, 2); }, 410);
            Array[0].style.width = '0%';
            Array[1].style.width = '0%';
            if (playerTurn)
            {
                InfoDIV.textContent = ++Counter;
                return 1;
            }
            else
            {
               // console.log(AI);
                AiInfoDIV.textContent = ++AiCounter;
                return 2;
            }
        }   
        //else{}
            HideBack(Array[0]);
            HideBack(Array[1]);
            playerTurn = !playerTurn;
            RevealedCards.splice(0, 2);
            SwitchControl();
            return -1;
    }
    function IMGClick(event, AI = false)
    {
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
        image.removeEventListener('click',IMGClick);
        setTimeout(() => {
            image.style = undefined;
            switch (image.id) {
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
   
    function HideBack(image)
    {
        image.style = 'animation:SetOut 0.4s alternate 1';
        image.style.animationPlayState = 'running';
        if(playerTurn) image.addEventListener('click', IMGClick);
        setTimeout(() => {
            image.style = "animation:SetIn 0.4s alternate 1";
            image.src = 'Content\\Units\\TurretT4_Field.png';
            image.className = 'wololo';
        }, 350);
    }


    //наборы клавиш
    //let List=new Array();
    function Keys(event) { if (!playerTurn && event.key == 'l') Test();}
    document.addEventListener('keyup', Keys);
    Game = null;
};
let CreateMenu = function ()
{
    
    let Menu = document.createElement('div');
    let StartButton = document.createElement('button');
    let OptionsButton = document.createElement('button');

    let OptionsCount = 4;

    Menu.className = 'StartMenu';
    Menu.style.animation = 'MenuStart 0.4s alternate 1';
    Menu.style.animationPlayState = 'running';  
    Menu.style.textAlign = 'center';
    Menu.style.verticalAlign = 'top';
    Menu.style.height = window.innerHeight*0.75 + 'px';   

    StartButton.textContent = "Начать";
    OptionsButton.textContent = "Опции";
    Menu.append(StartButton,OptionsButton);
    StartButton.addEventListener('click', (event) => {
            Menu.style.animation = 'MenuEnd 0.8s alternate 1';
            Menu.style.animationPlayState = 'running';
            setTimeout(() => { Menu.remove(); Game(OptionsCount); }, 700);
        });

    OptionsButton.addEventListener('click', function RevealOptions(event)
    {
        let OptionsTable = document.createElement('table');
        OptionsTable.style.animation = 'MenuStart 0.8s alternate 1';
        OptionsTable.style.animationPlayState = 'running';
        Menu.appendChild(OptionsTable);
        OptionsButton.removeEventListener('click', RevealOptions);
        for (let i = 0; i < 3; i++)
        {
            // i можно передать как аргумент для размера массива памяти
            let TempButton = document.createElement('button');
            TempButton.textContent = Math.pow(2, i);
            TempButton.addEventListener('click', (event) =>
            {
                OptionsCount = parseInt(event.target.textContent, 10);
                OptionsTable.style.animation = 'MenuEnd 0.2s alternate 1';
                OptionsTable.style.animationPlayState = 'running';
                setTimeout(() => { OptionsTable.remove(); OptionsButton.addEventListener('click', RevealOptions); }, 150);
            });
            OptionsTable.append(TempButton);
        }
    }
    )
    document.body.append(Menu);
}
window.onload = (event) => { CreateMenu();};