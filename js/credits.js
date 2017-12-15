var creditsState = {

    create: function () {
        this.creditCount = 0;
        this.addCredit('Developer', 'Christian Zellot');
        this.addCredit('Developer', 'Lorenz Schmoliner');
        this.addCredit('Developer', 'Lukas Knoch-Girstmair');
        this.addCredit('Game Concept', 'Diana Schaffer');
        this.addCredit('Game Design', 'Matthias Kostwein');
        this.addCredit('Producer', 'Veit Frick');
        this.addCredit('Art', 'Gabriel Napetschnig');
    },
    addCredit: function(task, author) {
        var authorStyle = { font: '40pt TheMinion', fill: 'white', align: 'center', stroke: 'rgba(0,0,0,0)', strokeThickness: 4};
        var taskStyle = { font: '30pt TheMinion', fill: 'white', align: 'center', stroke: 'rgba(0,0,0,0)', strokeThickness: 4};
        var authorText = game.add.text(game.world.centerX, 900, author, authorStyle);
        var taskText = game.add.text(game.world.centerX, 950, task, taskStyle);
        authorText.anchor.setTo(0.5);
        authorText.stroke = "rgba(0,0,0,0)";
        authorText.strokeThickness = 4;
        taskText.anchor.setTo(0.5);
        taskText.stroke = "rgba(0,0,0,0)";
        taskText.strokeThickness = 4;
        game.add.tween(authorText).to( { y: -300 }, 20000, Phaser.Easing.Cubic.Out, true, this.creditCount * 10000);
        game.add.tween(taskText).to( { y: -200 }, 20000, Phaser.Easing.Cubic.Out, true, this.creditCount * 10000);
        this.creditCount ++;
    }
};