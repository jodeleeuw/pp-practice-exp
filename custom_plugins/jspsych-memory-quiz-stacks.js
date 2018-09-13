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
    css += ".card-left:after{ background-color: #f9f0cc; background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fill='%23ca7d00' fill-opacity='0.4' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\");}";
    css += ".card-right:after{ background-color: #DFDBE5; background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='18' viewBox='0 0 100 18'%3E%3Cpath fill='%23c750c3' fill-opacity='0.58' d='M61.82 18c3.47-1.45 6.86-3.78 11.3-7.34C78 6.76 80.34 5.1 83.87 3.42 88.56 1.16 93.75 0 100 0v6.16C98.76 6.05 97.43 6 96 6c-9.59 0-14.23 2.23-23.13 9.34-1.28 1.03-2.39 1.9-3.4 2.66h-7.65zm-23.64 0H22.52c-1-.76-2.1-1.63-3.4-2.66C11.57 9.3 7.08 6.78 0 6.16V0c6.25 0 11.44 1.16 16.14 3.42 3.53 1.7 5.87 3.35 10.73 7.24 4.45 3.56 7.84 5.9 11.31 7.34zM61.82 0h7.66a39.57 39.57 0 0 1-7.34 4.58C57.44 6.84 52.25 8 46 8S34.56 6.84 29.86 4.58A39.57 39.57 0 0 1 22.52 0h15.66C41.65 1.44 45.21 2 50 2c4.8 0 8.35-.56 11.82-2z'%3E%3C/path%3E%3C/svg%3E\");}";
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
      html += '<div class="card card-left" style="animation: left-'+i+' 0.5s forwards;"></div>';
    }
    
    // add RIGHT stack
    for(var i=trial.right_stack_count; i>0; i--){
      html += '<div class="card card-right" style="animation: right-'+i+' 0.5s forwards;"></div>';
    }

    // add TARGET
    html += '<div id="study-card" class="card '+mainCardClass+'" style="animation: '+mainCardAnimation+' 0.5s forwards;">';
    if(trial.display == 'pair'){
      html += '<p style="line-height:150px; margin:0;">'+trial.cue+'</p>';
      html += '<p style="line-height:150px; margin:0;">'+trial.target+'</p>';
    }
    if(trial.display == 'test'){
      html += '<p style="line-height:150px; margin:0;">'+trial.cue+'</p>';
      html += '<input type="text" class="quiz-input"></input>';
      html += '<p class="quiz-subtext">Type a question mark (?) if you can\'t remember.</p>';
    }
    html += '</div>';

    // add LABELS
    html += '<p id="trial_count" style="visibility: hidden;">'+trial.question_number+' of '+trial.total_questions+'</p>';
    html += '<p id="left_remain">'+trial.left_stack_count+' restudy cards left</p>';
    html += '<p id="right_remain">'+trial.right_stack_count+' practice test cards left</p>';

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
        rt_method: 'date',
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
