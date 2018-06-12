/**
 * jspsych-wheel-game
 * Josh de Leeuw
 *
 * plugin for playing a spinning wheel game in the memory experiment
 *
 * documentation: docs.jspsych.org
 *
 **/

jsPsych.plugins["wheel-game"] = (function() {

    var plugin = {};
  
    plugin.info = {
      name: 'wheel-game',
      description: '',
      parameters: {
        outcomes: {
          type: jsPsych.plugins.parameterType.INT,
          default: undefined
        }
      }
    }
  
    plugin.trial = function(display_element, trial) {
  
        var html = '<style>';
        html += '.textContainer { width: 50%; display: inline-block; }';
        html += '.mini-card { color: #555; font-size: 24px; line-height: 45px; width: 150px; height: 90px; margin: auto; background-color: #fff; box-shadow:   0 2px 4px 0 rgba(0,0,0,0.50) }';
        html += '.mini-shiny-card { color: #555; background: linear-gradient(225deg, #fefcea 0%, #f1da36 100%); font-size: 24px; line-height: 45px; width: 150px; height: 90px; margin: auto; background-color: #fff; box-shadow:   0 2px 4px 0 rgba(0,0,0,0.50),   0 0 10px 5px rgba(255,255,170, 0.85) }';
        html += '.mini-card p, .mini-shiny-card p { margin:0; }';
        html += '.mini-shiny-card input[type="text"], .mini-card input[type="text"] { font-size: 24px; font-family: "Open Sans"; color: #555; text-align: center; width: 120px; border: 1px solid #ccc; border-radius: 3px; }';
        html += '@keyframes pop-out { 0% { transform:scale(1); } 100% { transform:scale(0);} }';
        html += '.peg, .wheelSVG { visibility: hidden; }';
        html += '.wheelContainer{ width: 50%; height: 100%; margin: 0; padding: 0; float: left; position: relative; }';
        html += '.centerCircle, .valueContainer, .wheelOutline, .wheelText { pointer-events: none; }';
        html += '.toast, .wheelContainer{ text-align: center; }';
        html += '.toast, button { background-color: #FFA500; }';
        html += '.wheelSVG { overflow: visible; width: 500px; height: 500px; }';
        html += '.wheelText { text-anchor: middle; font-family: "Open Sans", Arial, sans-serif; -webkit-user-select: none; user-select: none; }';
        html += '.toast { border-radius: 12px; opacity: 0; position: absolute; top: calc(-50px + 50%); left: calc(-150px + 50%); height: 100px; width: 300px; }';
        html += '.toast p { clear: both; font-family: "Open Sans", Arial, sand-serif; margin: 23px; font-size: 18px; color: #ededed; letter-spacing: 0; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; line-height: 24px; -webkit-transition: line-height .2s ease; transition: line-height .2s ease; }';
        html += 'button.spinBtn { width: 80%; max-width: 400px; padding: 20px; font-weight: 700; font-size: 32px; color: #ededed; border-radius: 6px; border: none; cursor: pointer; font-family: "Open Sans", Helvetica, Arial, sans-serif; }';
        html += 'button.spinBtn:hover { background: #FF8C00; }';
        html += 'button:focus { outline: 0; }';
        html += '</style>';

        html += '<div id="game-holder" style="width:1000px; height: 500px; background-color:white;">';
        html += '<div class="wheelContainer">';
        html += '<svg class="wheelSVG" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" text-rendering="optimizeSpeed">';
        html += '<defs>';
        html += '<filter id="shadow" x="-100%" y="-100%" width="550%" height="550%">';
        html += '<feOffset in="SourceAlpha" dx="0" dy="0" result="offsetOut"></feOffset>';
        html += '<feGaussianBlur stdDeviation="9" in="offsetOut" result="drop" />';
        html += '<feColorMatrix in="drop" result="color-out" type="matrix" values="0 0 0 0   0';
        html += '0 0 0 0   0 ';
        html += '0 0 0 0   0 ';
        html += '0 0 0 .3 0" />';
        html += '<feBlend in="SourceGraphic" in2="color-out" mode="normal" />';
        html += '</filter>';
        html += '</defs>';
        html += '<g class="mainContainer">';
        html += '<g class="wheel">';
        html += '<!-- <image  xlink:href="http://example.com/images/wheel_graphic.png" x="0%" y="0%" height="100%" width="100%"></image> -->';
        html += '</g>';
        html += '</g>';
        html += '<g class="centerCircle" />';
        html += '<g class="wheelOutline" />';
        html += '<g class="pegContainer" opacity="1">';
        html += '<path class="peg" fill="#EEEEEE" d="M22.139,0C5.623,0-1.523,15.572,0.269,27.037c3.392,21.707,21.87,42.232,21.87,42.232 s18.478-20.525,21.87-42.232C45.801,15.572,38.623,0,22.139,0z" />';
        html += '</g>';
        html += '<g class="valueContainer" />';
        html += '</svg>';
        html += '<div class="toast">';
        html += '<p/>';
        html += '</div> ';
        html += '</div>';
        html += '<div class="textContainer">';
        html += '<p style="font-size: 36px;">Win practice trials!</p>';
        html += '<div style="width: 50%; float: left;">';
        html += '<div class="mini-card"><p>napkin</p><p>viking</p></div>';
        html += '<p>There are<br><span id="numLeft" style="font-weight: bold; color: red; font-size:36px;">32</span><br>study trials remaining</p>';
        html += '</div>';
        html += '<div style="width: 50%; display: inline-block;">';
        html += '<div class="mini-shiny-card"><p>napkin</p><input type="text" class="mini-quiz-input" value="?"></input></div>';
        html += '<p>You\'ve won<br><span id="numWon" style="font-weight: bold; color: limegreen; font-size:36px;">0</span><br>practice trials</p>';
        html += '</div>';
        html += '<p style="font-size:22px;">You have <span id="spinsLeft">4 spins</span> remaining</p>';
        html += '<button id="spinBtn" class="spinBtn">Spin!</button>';
        html += '</div>';
        html += '</div>';

        display_element.innerHTML = html;

        var wheelValues = [2,1,6,8,3,1,4];
        var outcomes = trial.outcomes; //[3,7,4,3];
        var numSpins = outcomes.length;
        var wins = 0;

        var upSound = new Audio('audio/powerUp8.mp3');

        function countUp(remaining, callback){
            wins++;
            upSound.play();
            document.querySelector('#numWon').innerHTML = wins;
            document.querySelector('#numLeft').innerHTML = 32 - wins;
            if(remaining > 1){
                upSound.addEventListener('ended', function(){
                countUp(remaining-1, callback);
                upSound.currentTime = 0;
                }, {once: true});
            } else {
                callback();
            }
        }

        function myResult(e) {

            // implement some kind of tone count up
            countUp(e.userData.score, function(){

            });

            numSpins--;
            var spinMsg = "no spins"
            if(numSpins == 1){
                spinMsg = "1 spin"
            } else {
                spinMsg = numSpins + " spins"
            }
            document.querySelector('#spinsLeft').innerHTML = spinMsg;
            }

        function myError(e) {
            //e is error object
            console.log('Spin Count: ' + e.spinCount + ' - ' + 'Message: ' +  e.msg);
        }

        function myGameEnd(e) {
            document.querySelector('#spinBtn').innerHTML = "Continue"
            document.querySelector('#spinBtn').addEventListener('click', function(){
                document.querySelector('#game-holder').addEventListener('animationend', end_trial);
                document.querySelector('#game-holder').style.animation = 'pop-out 0.2s linear forwards';
            }, {once: true})
        }

        function init() {
            var data = {
                "colorArray":   [ "#364C62", "#F1C40F", "#E67E22", "#E74C3C", "#95A5A6", "#16A085", "#27AE60", "#2980B9", "#8E44AD", "#2C3E50", "#F39C12", "#D35400", "#C0392B", "#BDC3C7","#1ABC9C", "#2ECC71", "#E87AC2", "#3498DB", "#9B59B6", "#7F8C8D"],
                "segmentValuesArray" : [
                    {"type": "string", "value": "+2", "win": false, "resultText": "You win 2 additional practice test trials.", "userData": {"score":2}},
                    {"type": "string", "value": "+1", "win": false, "resultText": "You win 1 additional practice test trial.", "userData": {"score":1}},
                    {"type": "string", "value": "+6", "win": false, "resultText": "Wow! You win 6 additional practice test trials.", "userData": {"score":6}},
                    {"type": "string", "value": "+8", "win": false, "resultText": "Awesome! You win 8 additional practice test trials.", "userData": {"score":8}},
                    {"type": "string", "value": "+3", "win": false, "resultText": "Not bad. That's 3 additional practice test trials!", "userData": {"score":3}},
                    {"type": "string", "value": "+1", "win": false, "resultText": "You win 1 additional practice test trial.", "userData": {"score":1}}, 
                    {"type": "string", "value": "+4", "win": false, "resultText": "Nice spin. You win 4 additional practice test trials.", "userData": {"score":4}}
                ],
                "svgWidth": 500,
                "svgHeight": 500,
                "wheelStrokeColor": "#CCCCCC",
                "wheelStrokeWidth": 10,
                "wheelSize": 400,
                "wheelTextOffsetY": 70,
                "wheelTextColor": "#EDEDED",  
                "wheelTextSize": "2em",
                "wheelImageOffsetY": 50,
                "wheelImageSize": 50,
                "centerCircleSize": 150,
                "centerCircleStrokeColor": "#CCCCCC",
                "centerCircleStrokeWidth": 8,
                "centerCircleFillColor": "#EDEDED",
                "segmentStrokeColor": "#E2E2E2",
                "segmentStrokeWidth": 4,
                "centerX": 250,
                "centerY": 250,  
                "hasShadows": false,
                "numSpins": numSpins ,
                "spinDestinationArray": outcomes,
                "minSpinDuration":6,
                "gameOverText":"That's the end of the game! Please click continue.",
                "invalidSpinText":"INVALID SPIN. PLEASE SPIN AGAIN.",
                //"introText":"YOU HAVE TO<br>SPIN IT <span style='color:#F282A9;'>2</span> WIN IT!",
                "hasSound":true,
                "gameId":"9a0232ec06bc431114e2a7f3aea03bbe2164f1aa",
                "clickToSpin":true,
                "spinDirection":"ccw"
            }
            //if you want to spin it using your own button, then create a reference and pass it in as spinTrigger
            var mySpinBtn = document.querySelector('.spinBtn');
            //create a new instance of Spin2Win Wheel and pass in the vars object
            var myWheel = new Spin2WinWheel();
            //WITH your own button
            myWheel.init({data:data, onResult:myResult, onGameEnd:myGameEnd, onError:myError, spinTrigger:mySpinBtn});
        }

        //And finally call it
        init();
        
        // function to end trial when it is time
        function end_trial() {
    
            // kill any remaining setTimeout handlers
            jsPsych.pluginAPI.clearAllTimeouts();
    
            // gather the data to store for the trial
            var trial_data = {
            
            };
    
            // clear the display
            display_element.innerHTML = '';
    
            // move on to the next trial
            jsPsych.finishTrial(trial_data);
        }

    }
  
    return plugin;
  })();
  