var tutorialState = {

    backToMenu : function () {
        game.state.start('menu');
    },
    create: function () {
        var style = { font: '25px TheMinion', fill: '#FFFFFF', align: 'center'};
        // var text = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut\n" +
        //     " labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et\n" +
        //     " ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum\n" +
        //     " dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et\n" +
        //     " dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.\n" +
        //     " Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.";

        var text = "Build a hotel to satisfy your guests. Hire staff to clean up, build new and furnish your rooms,\n" +
            " and hope that your guests leave good reviews (Stars). Expand your hotel with extra facilities, like a\n" +
            " pool, a gym, a sauna (+) and many other such amenities. Guests have different demands and expectations\n" +
            " for the rooms they want to stay in and what other facilities they want to use during their stay. Provide\n" +
            " the right room and facilities for the right person to earn better reviews.";
        game.add.text(20, 20, text, style);
        game.input.onDown.add(this.backToMenu, this);

    },
};

