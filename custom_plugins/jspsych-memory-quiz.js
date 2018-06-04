/*
 * Example plugin template
 */

jsPsych.plugins["memory-quiz"] = (function() {

  var plugin = {};

  plugin.info = {
    name: "memory-quiz",
    parameters: {
      cue: {
        type: jsPsych.plugins.parameterType.STRING, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
        default: undefined
      },
      target: {
        type: jsPsych.plugins.parameterType.STRING, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
        default: undefined
      },
      slide_in: {
        type: jsPsych.plugins.parameterType.BOOL,
        default: false
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    var css = "<style id='trial-css'>";
    css += "@keyframes slide-in { 0% {transform: translateX(300%)} 100% {transform: translateX(0%)} }";
    css += "@keyframes slide-out { 0% {transform: translateX(0%)} 100% {transform: translateX(-300%)} }";
    css += "@keyframes glow { 0% { box-shadow: 0 0 40px 15px rgba(255,255,170, 0.85) } 100% { box-shadow: 0 0 40px 5px rgba(255,255,170, 0.85) } }";
    css += "#jspsych-content .quiz-input { font-size: 60px; font-family: 'Open Sans', sans-serif; color: #555; text-align: center; width: 400px; border: 1px solid #ccc; border-radius: 10px; }";
    css += "#jspsych-content .quiz-input:focus { outline: 0; }";
    css += "#jspsych-content .quiz-subtext { font-size: 14px; }";
    css += "#jspsych-content .card {  position: absolute; width: 500px; height: 300px; font-size:60px; font-family:'Open Sans'; color: #555; }";
    css += "#jspsych-content .regular-card { position: relative; width: 500px; height: 300px; background-color: #fff; box-shadow:   0 2px 4px 0 rgba(0,0,0,0.50) }";
    css += "#jspsych-content .shiny-card { position: relative; width: 500px; height: 300px; background: linear-gradient(225deg, #fefcea 0%, #f1da36 100%); animation: glow 1s infinite linear alternate; box-shadow:   0 2px 4px 0 rgba(0,0,0,0.50) }";
    css += ".jspsych-display-element { overflow-x: hidden; }"
    css += "</style>"

    var html = css;
    html += '<div id="card-holder" style="width:500px; height: 350px; position: relative;">';
    html += '<div id="card" class="card"';
    if(trial.slide_in){
      html += ' style="animation: slide-in 0.5s forwards;"'
    }
    html += '>';
    if(trial.shiny){
      html += '<div class="shiny-card">';
    } else {
      html += '<div class="regular-card">';
    }
    html += '<p style="line-height:150px; margin:0;">'+trial.cue+'</p>';
    if(trial.display == "pair"){
      html += '<p style="line-height:150px; margin:0;">'+trial.target+'</p>';
    } else if(trial.display == "test") {
      html += '<input type="text" class="quiz-input"></input>';
      html += '<p class="quiz-subtext">Type a question mark (?) if you can\'t remember.</p>';
    }
    html += '</div>';
    html += '</div>';
    if(trial.question_number < trial.total_questions){
      html += '<div id="card-next" class="card" style="visibility:hidden;">';
      if(trial.next_shiny){
        html += '<div class="shiny-card">';
      } else {
        html += '<div class="regular-card">';
      }
      html += '<p style="line-height:150px; margin:0;">'+trial.next_cue+'</p>';
      if(trial.next_display == "pair"){
        html += '<p style="line-height:150px; margin:0;">'+trial.next_target+'</p>';
      } else if(trial.next_display == "test") {
        html += '<input type="text" class="quiz-input"></input>';
        html += '<p class="quiz-subtext">Type a question mark (?) if you can\'t remember.</p>';
      }
      html += '</div>';
      html += '</div>';
    }
    html += '<p id="sub" style="font-size: 18px; font-weight: bold; color: white; margin: 0; padding-top: 320px">'+trial.question_number+' of '+trial.total_questions+'</p>';
    html += '</div>';
    html += '</div>';

    display_element.innerHTML = html;

    if(trial.display == 'test'){
      display_element.querySelector('.quiz-input').focus();

      jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: [13],
        rt_method: 'date',
        persist: false,
        allow_held_key: false
      });
    } else if(trial.display == 'pair') {
      var duration = trial.slide_in ? trial.study_duration + 500 : trial.study_duration;
      jsPsych.pluginAPI.setTimeout(slide_out, duration)
    }

    function after_response(info){
      slide_out();
    }

    function slide_out(){
      document.querySelector('#card').addEventListener('animationend', end_trial);

      document.querySelector('#card').style.animation = "slide-out 0.5s forwards";
      if(trial.question_number < trial.total_questions){
        document.querySelector('#sub').innerHTML = (trial.question_number+1) + ' of ' + trial.total_questions;
        document.querySelector('#card-next').style.visibility = 'visible';
        document.querySelector('#card-next').style.animation = "slide-in 0.5s ease-out forwards";
      } else {
        document.querySelector('#sub').innerHTML = "";
      }
    }

    function end_trial(){

      display_element.innerHTML = '';

      // data saving
      var trial_data = {
        parameter_name: 'parameter value'
      };

      // end trial
      jsPsych.finishTrial(trial_data);
    }

  };

  return plugin;
})();
