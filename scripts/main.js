$(document).ready(function() {

  const $level = $('#level');
  const $hp = $('#hp');
  const $maxHp = $('#max-hp');
  const $mp = $('#mp');
  const $maxMp = $('#max-mp');
  const $xp = $('#xp');
  const $xpToLvl = $('#xp-to-lvl');
  const $gold = $('#gold');
  const $atkBtn = $('#attack');
  const $fleeBtn = $('#flee');
  const $townPanel = $('#town-panel');
  const $attackPanel = $('#attack-panel');
  const $shopPanel = $('#shop-panel');
  const $characterPanel = $('.right');
  const $characterName = $('#character-name');
  const $characterAvatar = $('#character-avatar');
  const $monsterHp = $('#monster-hp');
  const $monsterMaxHp = $('#monster-max-hp');
  const $log = $('#log');

  const $exWastelands = $('#ex-wastelands');
  const $shop = $('#shop');

  const game = {
    player: {
      level: 1,
      hp: 80,
      maxHp: 80,
      mp: 10,
      maxMp: 10,
      xp: 0,
      xpToLvl: 8,
      atk: 5,
      gold: 0,
      inventory: []
    },
    state: {
      combat: false
    },
    npc: {
      cinger: {
        name: 'Cinger',
        avatar: 'http://via.placeholder.com/120x120'
      }
    },
    monster: {
      Bloodbeast: function() {
        this.name = 'Bloodbeast';
        this.avatar = 'http://via.placeholder.com/120x120';
        this.hp = 45;
        // this.hp = 4;
        this.atk = 5;
        this.atkRng = 2;
        this.xp = 2;
        this.gold = 2;
        this.goldRng = 2;
      },
      attack: function(enemy) {
        let getAtkNum = getRandomInt(enemy.atk - enemy.atkRng, enemy.atk + enemy.atkRng)
        game.player.hp -= getAtkNum;
        logText(`${enemy.name} hit you for ${getAtkNum} damage.`);
        updatePlayerStats();
      }
    }/*,
    items: {
      hpPotion: {
        name: 'HP Potion'
      }
    }*/
  };

  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const nextLevel = level => {
    let exponent = 1.4;
    let baseXP = 8;
    return Math.floor(baseXP * (level ** exponent));
  }

  const updatePlayerXP = (monster) => {
    game.player.xp += monster.xp;
    $xp.text(game.player.xp);
    if (game.player.xp >= game.player.xpToLvl) {
      game.player.xp -= game.player.xpToLvl;
      $xp.text(game.player.xp);
      let nextLvlXp = nextLevel(game.player.level + 1)
      game.player.xpToLvl = nextLvlXp;
      $xpToLvl.text(nextLvlXp);
      game.player.level++;
      $level.text(game.player.level);
    }
  };

  const updatePlayerGold = (monster) => {
    game.player.gold += monster.gold;
    $gold.text(game.player.gold);
  };

  const updatePlayerStats = () => {
    if (game.player.hp !== $hp.text()) {
      if (game.player.hp <= 0) {
        $hp.text(0);
        console.log('RIP - PLAYER DIED');
      } else {
        $hp.text(game.player.hp);
      }
    }
    if (game.player.mp !== $mp.text()) {
      $mp.text(game.player.mp);
    }
  };

  const updateMonsterStats = monster => {
    if ($monsterHp !== monster.hp) {
      monster.hp <= 0 ? $monsterHp.text(0) : $monsterHp.text(monster.hp);
    }
  };

  /* const refreshInventory = () => {

  }; */

  const renderPanels = (modeType, npc) => {
    if (modeType == 'combat') {
      $townPanel.hide();
      $attackPanel.show();
      $characterPanel.show();
      game.state.combat = true;
    } else if (modeType == 'town') {
      $townPanel.show();
      $attackPanel.hide();
      $characterPanel.hide();
      game.state.combat = false;
    } else if (modeType == 'shop') {
      $townPanel.hide();
      $attackPanel.hide();
      $characterPanel.show();
      $shopPanel.show();
      populateCharUI(npc);
    }
  };

  const checkKill = monster => {
    if (monster.hp <= 0) {
      setTimeout(function() {
        logText(`You have defeated a ${monster.name}.`);
        updatePlayerXP(monster);
        updatePlayerGold(monster);
        renderPanels('town');
        $atkBtn.off('click');
      }, 1000);
    }
  };

  function logText(string) {
    let logVal = $log.val();
    $log.val(`${logVal + string} \n`);
    $log.scrollTop($log[0].scrollHeight);
  };

  const playerAttack = (monster) => {
    $atkBtn.prop('disabled', true);
    setTimeout(function() {
      $atkBtn.prop('disabled', false);
    }, 1500);
    let roll = Math.floor(Math.random() * 16);
    if(roll === 15) { // Miss
      logText('You missed.');
    } else if (roll >= 0 && roll < 3) { // Crit
      let damageGiven = Math.floor(game.player.atk * 1.5)
      monster.hp -= damageGiven;
      logText(`You critical hit ${monster.name} for ${damageGiven} damage.`);
    } else { // Hit
      monster.hp -= game.player.atk;
      logText(`You hit ${monster.name} for ${game.player.atk} damage.`);
    }
    updateMonsterStats(monster);
    checkKill(monster);
  };

  const monsterAttack = monster => {
    if(monster.hp > 0) {
      setTimeout(function() {
        game.monster.attack(monster);
      }, 750);
    }
  };

  const populateCharUI = character => {
    $characterName.text(character.name);
    $characterAvatar.attr('src', character.avatar);
    $monsterHp.text(character.hp);
    $monsterMaxHp.text(character.hp);
  };

  const combat = monster => {
    renderPanels('combat');
    populateCharUI(monster);
    $atkBtn.bind('click', () => {
      playerAttack(monster);
      monsterAttack(monster);
    });
  };

  setInterval(() => {
    if (!game.state.combat) {
      if(game.player.hp < game.player.maxHp) {
        game.player.hp += 1;
      }
      if(game.player.mp < game.player.maxMp) {
        game.player.mp += 1;
      }
      updatePlayerStats();
    }
  }, 1000);

  $exWastelands.on('click', () => {
    combat(new game.monster.Bloodbeast());
  });

  $shop.on('click', () => {
    renderPanels('shop', game.npc.cinger);
  });

});
