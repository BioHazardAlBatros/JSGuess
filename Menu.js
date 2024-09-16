let CreateMenu = function () {
    titleName.textContent = "JSGuess! Меню";
    
    let Menu = document.createElement('div');
    let titleHeader = Menu.appendChild(document.createElement('h1'));
    titleHeader.textContent = "JSGuess!";
    let StartButton = document.createElement('button');
    let OptionsButton = document.createElement('button');

    let OptionsCount = 2;

    Menu.className = 'StartMenu';
    Menu.style.animation = 'MenuStart 0.4s alternate 1';
    Menu.style.animationPlayState = 'running';
    Menu.style.textAlign = 'center';
    Menu.style.verticalAlign = 'top';
    Menu.style.height = window.innerHeight * 0.75 + 'px';

    StartButton.textContent = "Начать";
    OptionsButton.textContent = "Выбор сложности";
    Menu.append(StartButton, OptionsButton);
    StartButton.addEventListener('click', (event) => {
        Menu.style.animation = 'MenuEnd 0.8s alternate 1';
        Menu.style.animationPlayState = 'running';
        setTimeout(() => { titleName.textContent = "JSGuess! Игра"; Menu.remove(); Game(OptionsCount); }, 700);
    });

    OptionsButton.addEventListener('click', function RevealOptions(event) {
        let OptionsTable = document.createElement('table');
        OptionsTable.style.animation = 'MenuStart 0.8s alternate 1';
        OptionsTable.style.animationPlayState = 'running';
        Menu.appendChild(OptionsTable);
        OptionsButton.removeEventListener('click', RevealOptions);
        for (let i = 0; i < 3; i++) {
            // i можно передать как аргумент для размера массива памяти
            let TempButton = document.createElement('button');
            TempButton.textContent = Math.pow(2, i);
            TempButton.addEventListener('click', (event) => {
                OptionsCount = parseInt(event.target.textContent, 10);
                OptionsTable.style.animation = 'MenuEnd 0.2s alternate 1';
                OptionsTable.style.animationPlayState = 'running';
                setTimeout(() => { OptionsTable.remove(); OptionsButton.addEventListener('click', RevealOptions); }, 150);
            });
            TempButton.addEventListener('mouseover', (event) => {
                OptionDescription = OptionsTable.appendChild(document.createElement('div'));
                OptionDescription.id = "Description";
                OptionDescription.textContent = "x"+TempButton.textContent + " множитель сложности.";
            });
            TempButton.addEventListener('mouseleave', (event) => {
                document.getElementById("Description").remove();
            })
            OptionsTable.append(TempButton);
        }
    }
    )
    document.body.append(Menu);
}