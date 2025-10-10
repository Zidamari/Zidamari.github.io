document.addEventListener('DOMContentLoaded', () => {

    // =================================================
    // GAME STATE & CONFIG
    // =================================================
    const game = {
        state: 'START_SCREEN', // or BATTLE, POST_BATTLE, SHOP
        player: null,
        currentBattle: 1,
        totalBattles: 8,
        gold: 0,
        failedRunBonus: 0, // Bonus gold for failing
    };

    // --- DOM ELEMENTS ---
    const screens = {
        start: document.getElementById('start-screen'),
        battle: document.getElementById('battle-screen'),
        postBattle: document.getElementById('post-battle-screen'),
        shop: document.getElementById('shop-screen'),
    };
    const resumeChoicesContainer = document.getElementById('resume-choices');
    const postBattleChoicesContainer = document.getElementById('post-battle-choices');
    // ... get other elements as needed

    // =================================================
    // CORE GAME LOOP
    // =================================================

    function switchScreen(screenName) {
        Object.values(screens).forEach(screen => screen.classList.remove('active'));
        screens[screenName].classList.add('active');
    }

    function startNewRun() {
        game.state = 'START_SCREEN';
        game.currentBattle = 1;
        game.gold = 0;
        switchScreen('start');
        renderResumeChoices();
    }

    function renderResumeChoices() {
        // TODO: Generate 3 random résumé objects.
        // Create HTML cards for each résumé.
        // Add click listeners to each card that call `selectResume`.
        resumeChoicesContainer.innerHTML = `
            <div class="card" data-resume-id="1">
                <h4>PLACEHOLDER: The Coder</h4>
                <p>Quirk: Caffeine Addict</p>
                <p>Quirk: Imposter Syndrome</p>
                <p>Starts with Asset: 'Refactor Code'</p>
            </div>
            `;
    }

    function selectResume(resumeData) {
        // TODO: Create the player object from the selected résumé.
        game.player = { name: "Placeholder", quirks: [], assets: [] };
        startBattle();
    }

    function startBattle() {
        game.state = 'BATTLE';
        switchScreen('battle');
        // TODO:
        // 1. Get the rival for the current battle number.
        // 2. Render the player and rival in the battle arena.
        // 3. Implement the "Intern Kaiser" spinner and battle logic.
        // 4. On battle completion, call endBattle(didPlayerWin).
        console.log(`Starting battle ${game.currentBattle}`);
    }

    function endBattle(didPlayerWin) {
        game.state = 'POST_BATTLE';
        switchScreen('postBattle');
        renderPostBattleChoices(didPlayerWin);
    }

    function renderPostBattleChoices(didPlayerWin) {
        postBattleChoicesContainer.innerHTML = ''; // Clear previous choices
        
        if (didPlayerWin) {
            document.getElementById('post-battle-title').textContent = 'Battle Won!';
            const goldWon = 50 + (game.currentBattle * 10); // Example gold calculation
            game.gold += goldWon;
            // TODO:
            // 1. Create a button/card to "Proceed to Performance Review".
            // 2. This button will have a listener that calls `goToShop`.
            postBattleChoicesContainer.innerHTML = `<p>You earned ${goldWon} Gold!</p><button id="proceed-btn">Proceed</button>`;
            document.getElementById('proceed-btn').addEventListener('click', goToShop);

        } else {
            document.getElementById('post-battle-title').textContent = 'Battle Lost...';
            const pityGold = Math.floor((50 + (game.currentBattle * 10)) * 0.5) + game.failedRunBonus;
            
            // Create the two choice buttons for the loss condition
            postBattleChoicesContainer.innerHTML = `
                <button id="choice-quirks">Accept 2 Negative Quirks & Retry Battle</button>
                <button id="choice-gold">Take ${pityGold} Gold & End Run</button>
            `;
            
            document.getElementById('choice-quirks').addEventListener('click', () => {
                // TODO: Add 2 random negative quirks to the player and restart the SAME battle.
                console.log("Player chose quirks. Rerunning battle...");
                startBattle();
            });
            document.getElementById('choice-gold').addEventListener('click', () => {
                // TODO: End the run. Add pityGold to a global failedRunBonus for the next playthrough.
                console.log("Player ended run.");
                game.failedRunBonus += 5; // Increase the bonus for next time
                startNewRun();
            });
        }
    }
    
    function goToShop() {
        game.state = 'SHOP';
        switchScreen('shop');
        renderShop();
    }
    
    function renderShop() {
        // TODO:
        // 1. Update the gold display.
        // 2. Generate 3 random Assets for sale.
        // 3. Add listeners to the Workshop and Therapy buttons.
        // 4. The "Continue" button should call `startNextBattle`.
        console.log("Rendering shop...");
    }
    
    function startNextBattle() {
        game.currentBattle++;
        if (game.currentBattle > game.totalBattles) {
            // TODO: Handle winning the entire run!
            console.log("You won the game!");
            startNewRun();
        } else {
            startBattle();
        }
    }

    // =================================================
    // EVENT LISTENERS & INITIALIZATION
    // =================================================
    resumeChoicesContainer.addEventListener('click', (e) => {
        if (e.target.closest('.card')) {
            selectResume(e.target.closest('.card').dataset.resumeId);
        }
    });

    startNewRun(); // Kick off the game
});