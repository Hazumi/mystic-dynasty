$(document).ready(function() {

  const $hp = $('#hp');
  const $maxHp = $('#max-hp');
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

  const game = {
    player: {
      rank: 1,
      hp: 200,
      maxHp: 200,
      mp: 25,
      maxMp: 25,
      atk: 10
    },
    state: {
      combat: false
    },
    monster: {
      bloodbeast: {
        name: 'Bloodbeast',
        avatar: 'http://via.placeholder.com/120x120',
        hp: 140,
        atk: 10
      },
      attack: function(enemy) {
        game.player.hp -= enemy.atk;
        $log.append(`<p>${enemy.name} hit you for ${enemy.atk} damage.</p>`);
        updatePlayerStats();
      }
    }
  };

  const updatePlayerStats = () => {
    if (game.player.hp !== $hp.text()) {
      $hp.text(game.player.hp);
    }
  };

  const updateMonsterStats = (monster) => {
    if ($monsterHp !== monster.hp) {
      $monsterHp.text(monster.hp);
    }
  };

  const combat = monster => {
    $townPanel.hide();
    $attackPanel.show();
    $monsterPanel.show();
    game.state.combat = true;
    $monsterName.text(monster.name);
    $monsterAvatar.attr('src', monster.avatar);
    $monsterHp.text(monster.hp);
    $monsterMaxHp.text(monster.hp);
    $atkBtn.on('click', () => {
      let roll = Math.floor(Math.random() * 16);
      if(roll === 15) { // Miss
        $log.append(`<p>You missed.</p>`);
      } else if (roll >= 0 && roll < 3) { // Crit
        monster.hp -= game.player.atk * 1.5;
        $log.append(`<p>You critical hit ${monster.name} for ${game.player.atk * 1.5} damage.</p>`);
      } else { // Hit
        monster.hp -= game.player.atk;
        $log.append(`<p>You hit ${monster.name} for ${game.player.atk} damage.</p>`);
      }
      updateMonsterStats(monster);

      setTimeout(function() {
        game.monster.attack(monster);
      }, 1200);



    });
  }

  while(game.state.combat) {

  }

  // Game Loop
  setInterval(() => {
    updatePlayerStats();
  }, 1000);

  $('#ex-wastelands').on('click', () => {
    combat(game.monster.bloodbeast);
  });
});
