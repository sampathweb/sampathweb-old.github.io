$(function() {
  var isUndefined = function isUndefined(value) {
      return typeof value === 'undefined';
  };

  var APP = {
    game_choices: ["0,0", "0,1", "0,2", "1,0", "1,1", "1,2", "2,0", "2,1", "2,2"],
    handle: "",
    player_a: [],
    player_b: [],
    my_move: false,
    game_started: false,
    game_result: '',
    ws: null,  // Will contain websocket connection
    ws_url_local: 'ws://' + 'localhost:8001' + '/tic-tac-toe/',
    ws_url: 'ws://' + 'websockets-test-ha-1776378039.us-west-1.elb.amazonaws.com' + '/tic-tac-toe/',

    reset_board: function() {
      $("ul.row button").each( function() {
        var button = $(this)
        var content = button.find(".content");
        if (content) {
          // set the game matrix
          content.text('_');
          button.prop("disabled", true);
          // button.off("click");
        }
      });
    },

    activate_board: function() {
      $("ul.row button").each( function() {
        var button = $(this)
        var content = button.find(".content");
        if (content) {
          // set the game matrix
          content.text('_');
          button.prop("disabled", false);
          // button.on("click");
        }
      });
    },

    initialize_socket: function(onmessage_cb, onerror_cb, onopen_cb, onclose_cb) {

      if (window.location.hostname == 'localhost') {
        var ws = new WebSocket(APP.ws_url_local);
      } else {
        var ws = new WebSocket(APP.ws_url);
      }

      ws.onmessage = function(e) {
        data = JSON.parse(e.data);
        onmessage_cb(data);
      };

      ws.onerror = function(e) {
        data = JSON.parse(e.data);
        onerror_cb(data);
      };

      ws.onopen = function() {
        onopen_cb();
      };

      ws.onclose = function() {
        onclose_cb();
      };

      // Return the websocket connection
      return ws;
    },

    send_msg: function(data) {
      var message = JSON.stringify(data);
      APP.ws.send(message);
    },

    wait_message: function() {
      $('.result').text('Hold on Tight. Waiting for someone to accept your challenge');
    },

    game_start_message: function() {
      $('.result').text('Game Started!');
    },

    move_message: function() {
      if (APP.my_move) {
        $('.message').text('Your Turn to Move!');
      } else {
        $('.message').text('Waiting for your opponent to make a move!');          
      }
    },

    recvd_msg: function(data) {
      console.log(data);
      if (!isUndefined(data.handle)) {
        $('.handle').text(data.handle);
      }
      if (!isUndefined(data.hostname)) {
        $('.hostname').text(data.hostname);
      }
      if (!isUndefined(data.paired_handle)) {
        $('.paired_handle').text(data.paired_handle);
      }
      if (data.action == 'connect') {
        APP.handle = data.handle;
      } else if (data.action == 'wait-pair') {
        APP.my_move = false;  // Waiting for pairing
        APP.wait_message();
      } else if (data.action == 'game-start') {
        // Game Started
        APP.game_started = true;
        APP.activate_board();
        $('.result').text('Game Started!');
        APP.my_move = (data.next_handle == APP.handle) ? true : false;
        APP.move_message();
      } else if (data.action == 'player-move') {
        // Record the move
        if (data.handle != APP.handle) {
          sel_item = data.move;
          APP.player_b.push(sel_item);
          APP.game_choices.splice(APP.game_choices.indexOf(sel_item), 1);
          button = $('button[value="'+sel_item+'"]');
          if (button) {
            content = button.find(".content");
            content.text('O');
            button.prop("disabled", true);
            // button.off("click");
          }
        }
        APP.my_move = (data.next_handle == APP.handle) ? true : false;
        APP.move_message();
      } else if (data.action == 'game-end') {
        if (data.win_handle == APP.handle) {
          console.log("You Won");
          $('.result').text('You Won. Looking like a Pro!');
        } else if (data.win_handle == "") {
          console.log("Game Draw");
          $('.result').text('Game Draw. Challenge again?');
        } else {
          console.log("You Lost");
          $('.result').text('You Lost. Better Luck Next Time!');
        }
        APP.game_started = false;
        $("button.action").prop("disabled", false);
      }
    },

    ws_open: function(data) {
      // var message = JSON.stringify(data);
      // APP.ws.send(message);
    },

    ws_close: function() {
      APP.ws.close();
    },

    ws_error: function(message) {
      console.log('WS Err: ', message);
    }
  };

  var initalize_game = function() {
    APP.reset_board();
    APP.ws = APP.initialize_socket(APP.recvd_msg, APP.ws_error, APP.ws_open, APP.ws_close);
  };

  // On open, connect to socket and reset board
  initalize_game();

  // On Play Gain, reset the game
  $("button.action").on("click", function(event) {
    event.preventDefault();
    var button = $(this);
    if (APP.game_started) {
      // terminate the game
    } else {
      // start the game
      // APP.start_game();
      APP.reset_board();
      var data = {
        'handle': APP.handle,
        'action': 'ready'
      }
      APP.send_msg(data);
      button.prop("disabled", true);
    }
  });

  // When one of the button is pressed, send message to server
  $("ul.row button").on("click", function(event) {
    event.preventDefault();
    if (!APP.my_move) {
      console.log("It's not your move yet!. Wait for opponent to move");
      return;
    } else if (!APP.game_started) {
      console.log("No game is ON now!");
      return;
    }
    var button = $(this);
    var sel_item = button.val();
    APP.player_a.push(sel_item);
    APP.game_choices.splice(APP.game_choices.indexOf(sel_item), 1);
    var content = button.find(".content");
    if (content) {
      // set the game matrix
      content.text('X');
      button.prop("disabled", true);
      // button.off("click");
      // Send message to Server
      var data = {
        'handle': APP.handle,
        'action': 'player-move',
        'move': sel_item
      }
      console.log(data);
      APP.my_move = false;
      APP.send_msg(data);
    }
  });
});