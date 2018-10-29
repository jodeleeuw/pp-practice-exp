/*
 * Example plugin template
 */

jsPsych.plugins["memory-quiz-stacks"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('memory-quiz-stacks', 'correct_sound', 'audio');
  jsPsych.pluginAPI.registerPreload('memory-quiz-stacks', 'incorrect_sound', 'audio');

  plugin.info = {
    name: "memory-quiz-stacks",
    parameters: {
      cue: {
        type: jsPsych.plugins.parameterType.STRING, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
        default: undefined,
      },
      target: {
        type: jsPsych.plugins.parameterType.STRING, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
        default: undefined,
      },
      slide_in: {
        type: jsPsych.plugins.parameterType.BOOL,
        default: false
      },
      correct_sound: {
        type: jsPsych.plugins.parameterType.AUDIO,
        default: null,
      },
      incorrect_sound: {
        type: jsPsych.plugins.parameterType.AUDIO,
        default: null,
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    var trial_data = {}
    trial_data.cue = trial.cue;
    trial_data.target = trial.target;
    trial_data.display_type = trial.display;

    var mainCardClass = trial.display == 'pair' ? 'card-left' : 'card-right';
    var mainCardAnimation = trial.display == 'pair' ? 'flip-from-left' : 'flip-from-right';
    
    var css = "<style id='trial-css'>";
    css += ".jspsych-display-element { overflow-y: hidden; }"
    css += ".card, .card:after { position: absolute;  width:500px; height:300px; background-color:white; font-size:60px;  font-family:'Open Sans';  color: #555; text-align: center; border: 10px solid white; box-shadow: 0 2px 4px 0 rgba(0,0,0,0.50); backface-visibility: hidden; transform-style: preserve-3d; }";
    css += ".card:after { content: ''; position: absolute; top:0px; left:0px; transform: rotateX(180deg); }";
    css += "#trial_count, #left_remain, #right_remain { font-size: 18px; font-weight: bold; color: white; position: absolute; top: 105%; width: 100%; text-align: center; }";
    css += "#left_remain, #right_remain { border-radius: 10px; background: white; color: hsla(232, 41%, 56%, 1); padding: 2% }";
    css += "#left_remain { transform: translateX(-360px) translateY(110px); width: 46%; }";
    css += "#right_remain { transform: translateX(640px) translateY(110px); width: 46%; }";
    css += "#jspsych-content .quiz-input { font-size: 60px; font-family: 'Open Sans', sans-serif; color: #555; text-align: center; width: 400px; border: 1px solid #ccc; border-radius: 10px; }";
    css += "#jspsych-content .quiz-input:focus { outline: 0; }";
    css += "#jspsych-content .quiz-subtext { font-size: 14px; }";
    css += "@keyframes flip-from-left {";
    css += "0% { transform: rotateX(180deg) translateX(-500px) translateY(-200px) scale(0.5);  }";
    css += "100% { transform: rotateX(0deg) translateX(0) translateY(0) scale(1);  }";
    css += "}"
    css += "@keyframes flip-from-right {";
    css += "0% { transform: rotateX(180deg) translateX(500px) translateY(-200px) scale(0.5);  }";
    css += "100% { transform: rotateX(0deg) translateX(0) translateY(0) scale(1);  }";
    css += "}"
    css += "@keyframes slide-out {";
    css += "0% { transform: rotateX(0deg) translateX(0) translateY(0) scale(1);  }";
    css += "100% { transform: translateY(1000px); }";
    css += "}";
    for(var i=1; i <= trial.left_stack_count; i++){
      var ytranslate_from = -200 + (i) * 5;
      var scale_from = 0.5 + (i) * -0.01;
      var ytranslate_to = -200 + (i-1) * 5;
      var scale_to = 0.5 + (i-1) * -0.01;
      css += "@keyframes left-"+i+" {";
      if(mainCardClass == 'card-left'){
        css += "0% { transform: rotateX(180deg) translateX(-500px) translateY("+ytranslate_from+"px) scale("+scale_from+"); }";
      } else {
        css += "0% { transform: rotateX(180deg) translateX(-500px) translateY("+ytranslate_to+"px) scale("+scale_to+"); }";
      }
      css += "100% { transform: rotateX(180deg) translateX(-500px) translateY("+ytranslate_to+"px) scale("+scale_to+"); }";
      css += "} ";
    }
    for(var i=1; i <= trial.right_stack_count; i++){
      var ytranslate_from = -200 + (i) * 5;
      var scale_from = 0.5 + (i) * -0.01;
      var ytranslate_to = -200 + (i-1) * 5;
      var scale_to = 0.5 + (i-1) * -0.01;
      css += "@keyframes right-"+i+" {";
      if(mainCardClass == 'card-right'){
        css += "0% { transform: rotateX(180deg) translateX(500px) translateY("+ytranslate_from+"px) scale("+scale_from+"); }";
      } else {
        css += "0% { transform: rotateX(180deg) translateX(500px) translateY("+ytranslate_to+"px) scale("+scale_to+"); }";
      }
      css += "100% { transform: rotateX(180deg) translateX(500px) translateY("+ytranslate_to+"px) scale("+scale_to+"); }";
      css += "} ";
    }
    css += "</style>"

    var html = css;
    html += '<div id="card-holder" style="perspective: 1000px; width:500px; height: 300px; position: relative;">';
    
    // add LEFT stack
    for(var i=trial.left_stack_count; i>0; i--){
      html += '<div class="card card-left '+left_card_bg+'" style="animation: left-'+i+' 0.5s forwards;"></div>';
    }
    
    // add RIGHT stack
    for(var i=trial.right_stack_count; i>0; i--){
      html += '<div class="card card-right '+right_card_bg+'" style="animation: right-'+i+' 0.5s forwards;"></div>';
    }

    // add TARGET

    html += '<div id="study-card" class="card '+mainCardClass+' '+(mainCardClass=='card-left' ? left_card_bg : right_card_bg)+'" style="animation: '+mainCardAnimation+' 0.5s forwards;">';
    if(trial.display == 'pair'){
      html += '<p style="line-height:150px; margin:0;">'+trial.cue+'</p>';
      html += '<p style="line-height:150px; margin:0;">'+trial.target+'</p>';
    }
    if(trial.display == 'test'){
      html += '<p style="line-height:150px; margin:0;">'+trial.cue+'</p>';
      html += '<input type="text" class="quiz-input"></input>';
      html += '<p class="quiz-subtext">Type a question mark (?) if you can\'t remember. Press enter to submit.</p>';
    }
    html += '</div>';

    // add LABELS
    html += '<p id="trial_count" style="visibility: hidden;">'+trial.question_number+' of '+trial.total_questions+'</p>';
    html += '<p id="left_remain">'+trial.left_stack_count+' '+trial.left_card_type+' '+(trial.left_stack_count == 1 ? 'card' : 'cards')+' left</p>';
    html += '<p id="right_remain">'+trial.right_stack_count+' '+trial.right_card_type+' '+(trial.right_stack_count == 1 ? 'card' : 'cards')+' left</p>';

    html += '</div>';

    display_element.innerHTML = html;

    display_element.querySelector('#study-card').addEventListener('animationend', function(){
      if(trial.display == 'test'){
        display_element.querySelector('.quiz-input').focus();
      }
      document.querySelector('#trial_count').style.visibility = 'visible';
    })

    if(trial.display == 'test'){
      jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: [13],
        rt_method: 'performance',
        persist: false,
        allow_held_key: false
      });
    } else if(trial.display == 'pair') {
      jsPsych.pluginAPI.setTimeout(slide_out, trial.study_duration + 500)
    }

    function after_response(info){
      display_element.querySelector('.quiz-input').blur();
      var response = display_element.querySelector('.quiz-input').value.toLowerCase();
      var correct = response == trial.target;
      trial_data.response = response;
      trial_data.correct = correct;
      trial_data.rt = info.rt;
      slide_out();
    }

    function slide_out(){
      document.querySelector('#study-card').addEventListener('animationend', end_trial);
      document.querySelector('#trial_count').style.visibility = 'hidden';
      document.querySelector('#study-card').style.animation = "slide-out 0.5s forwards";
      /*if(trial.question_number < trial.total_questions){
        document.querySelector('#sub').innerHTML = (trial.question_number+1) + ' of ' + trial.total_questions;
        document.querySelector('#card-next').style.visibility = 'visible';
        document.querySelector('#card-next').style.animation = "slide-in 0.5s ease-out forwards";
      } else {
        document.querySelector('#sub').innerHTML = "";
      }*/
    }

    function end_trial(){

      display_element.innerHTML = '';

      // end trial
      jsPsych.finishTrial(trial_data);
    }

  };

  return plugin;
})();
