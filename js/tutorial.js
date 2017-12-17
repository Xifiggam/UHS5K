var tutorialState = {

    backToMenu : function () {
        game.state.start('menu');
    },
    create: function () {
        var style = { font: '25px TheMinion', fill: '#FFFFFF', align: 'center'};
        var text = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut\n" +
            " labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et\n" +
            " ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum\n" +
            " dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et\n" +
            " dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.\n" +
            " Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";
        game.add.text(20, 20, text, style);
        game.input.onDown.add(this.backToMenu, this);

    },
};

