/**
 * jspsych-dialog-video
 * Josh de Leeuw
 *
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["dialog-video"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('dialog-video', 'stimulus', 'video');

  plugin.info = {
    name: 'dialog',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.VIDEO,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The HTML string to be displayed'
      },
      width: {
        type: jsPsych.plugins.parameterType.INT,
        default: null
      },
      height: { 
        type: jsPsych.plugins.parameterType.INT,
        default: null
      },
      autoplay: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Autoplay',
        default: true,
        description: 'If true, the video will begin playing as soon as it has loaded.'
      },
      controls: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Controls',
        default: false,
        description: 'If true, the subject will be able to pause the video or move the playback to any point in the video.'
      },
    }
  }

  plugin.trial = function(display_element, trial) {

    var html = '<style>';
    html += '@keyframes pop-in { 0% { transform:scale(0); } 75% { transform:scale(1.1); } 100% { transform:scale(1);} }';
    html += '@keyframes pop-out { 0% { transform:scale(1); } 100% { transform:scale(0);} }';
    html += '</style>';


    var type = trial.stimulus.substr(trial.stimulus.lastIndexOf('.') + 1);
    type = type.toLowerCase();

    html += '<div id="jspsych-dialog-container" style="animation: pop-in 0.2s linear forwards; background: white; padding: 24px; box-shadow: 0 2px 4px 0 rgba(0,0,0,0.50)">'; 
    html += '<div id="jspsych-dialog-stimulus">';
    html += '<video id="jspsych-video-player" width="'+trial.width+'" height="'+trial.height+'" ';
    if(trial.autoplay){
      html += "autoplay ";
    }
    if(trial.controls){
      html +="controls ";
    }
    html+=">";
    //html+='<source src="'+trial.stimulus+'" type="video/'+type+'">';
    html +="</video>";
    html += '</div>';
    html += '</div>';

    display_element.innerHTML = html;
    
    document.querySelector('#jspsych-video-player').src = jsPsych.pluginAPI.getVideoBuffer(trial.stimulus);

    var starttime = performance.now();

    display_element.querySelector('#jspsych-video-player').onended = function(){
      check_replay();
    }

    function check_replay(){
      document.querySelector('#jspsych-video-player').style.visibility = 'hidden';
      var buttons = '<div id="btn-group" style="position:absolute; top:50%; left: 50%; transform: translate(-50%,-50%);">';
      buttons += '<div class="dialog-btn" style="display: inline-block; margin:8px" id="replay">Replay the video</div>';
      buttons += '<div class="dialog-btn" style="display: inline-block; margin:8px" id="continue">Continue</div>';
      buttons += '</div>';
      document.querySelector('#jspsych-dialog-stimulus').insertAdjacentHTML('beforeend', buttons);

      document.querySelector('#replay').addEventListener('click', function(){
        document.querySelector('#btn-group').remove();
        document.querySelector('#jspsych-video-player').style.visibility = 'visible';
        document.querySelector('#jspsych-video-player').currentTime = 0;
        document.querySelector('#jspsych-video-player').play();
      });
      document.querySelector('#continue').addEventListener('click', end_trial);
    }

    // function to end trial when it is time
    function end_trial() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      var trial_data = {
        stimulus: trial.stimulus,
        rt: performance.now() - starttime
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };
  };

  return plugin;
})();
