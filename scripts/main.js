$(document).ready(function() {

  const $hp = $('#hp');
  const $maxHp = $('#max-hp');
  const $mp = $('#mp');
  const $maxMp = $('#max-mp');
  const $xp = $('#xp');
  const $xpToLvl = $('#xp-to-lvl');
  const $atkBtn = $('#attack');
  const $fleeBtn = $('#flee');
  const $townPanel = $('#town-panel');
  const $attackPanel = $('#attack-panel');
  const $monsterPanel = $('.right');
  const $monsterName = $('#monster-name');
  const $monsterAvatar = $('#monster-avatar');
  const $monsterHp = $('#monster-hp');
  const $monsterMaxHp = $('#monster-max-hp');
  const $log = $('#log');

  const $exWastelands = $('#ex-wastelands');

  const game = {
    player: {
      level: 1,
      hp: 80,
      maxHp: 80,
      mp: 10,
      maxMp: 10,
      xp: 0,
      xpToLvl: 3,
      atk: 5,
      inventory: []
    },
    state: {
      combat: false
    },
    monster: {
      Bloodbeast: function() {
        this.name = 'Bloodbeast';
        this.avatar = 'http://via.placeholder.com/120x120';
        // this.hp = 45;
        this.hp = 4;
        this.atk = 6;
        this.atkRng = 1;
        this.xp = 1;
      },
      attack: function(enemy) {
        let getAtkNum = getRandomInt(enemy.atk - enemy.atkRng, enemy.atk + enemy.atkRng)
        game.player.hp -= getAtkNum;
        logText(`${enemy.name} hit you for ${getAtkNum} damage.`);
        updatePlayerStats();
      }
    }
  };

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function nextLevel(level){
    let exponent = 1.5;
    let baseXP = 10;
    return Math.floor(baseXP * (level ** exponent));
  }

  const updatePlayerXP = () => {
    if (game.player.xp !== $xp.text()) {
      if (game.player.xp >= game.player.xpToLvl) {
        game.player.xp -= game.player.xpToLvl;
        game.player.xpToLvl = nextLevel(game.player.level + 1);
      } else {
        $xp.text(game.player.xp);
      }
    }
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

  const renderPanels = modeType => {
    if (modeType == 'combat') {
      $townPanel.hide();
      $attackPanel.show();
      $monsterPanel.show();
      game.state.combat = true;
    } else if (modeType == 'town') {
      $monsterPanel.hide();
      $townPanel.show();
      $attackPanel.hide();
      game.state.combat = false;
    }
  }

  const checkKill = monster => {
    if (monster.hp <= 0) {
      setTimeout(function() {
        logText(`You have defeated a ${monster.name}.`);
        game.player.xp += monster.xp;
        updatePlayerXP();
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

  const populateEnemyUI = monster => {
    $monsterName.text(monster.name);
    $monsterAvatar.attr('src', monster.avatar);
    $monsterHp.text(monster.hp);
    $monsterMaxHp.text(monster.hp);
  };

  const combat = monster => {
    renderPanels('combat');
    populateEnemyUI(monster);
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
});
