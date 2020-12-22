/**
 * f2re
 * 
 * Файл для инициализации автодополнения
 * 
 * 
 */

// инициируем модель
window.ml_model = false;

document.addEventListener('DOMContentLoaded', function() {
  load_model();
  init_autocomplete();
}, false);


async function load_model(){
  // console.log(tf.keras.layers.InputSpec);
    window.ml_model = await tf.loadLayersModel('model/model.json', false);
    // console.log(window.ml_model.summary());
}

/**
 * фнукция генерации текста из нейросети
 * @param {*} _text 
 */
function generate_text(model, _text, num_generate=50){
  // Evaluation step (generating text using the learned model)
  // Converting our start string to numbers (vectorizing)
  let input_eval = [];
  input_eval = Array.from(_text).map( _=> char2idx[_] );
  input_eval = tf.tensor2d([input_eval])
  // console.log(_text);
  // input_eval.print();

  //   # Empty string to store our results
  text_generated = [];
  //   # Low temperature results in more predictable text.
  //   # Higher temperature results in more surprising text.
  //   # Experiment to find the best setting.
  temperature = 1.0
  model.resetStates();
  let i =0;
  for (i=0; i< num_generate; i++){
    let predictions = model.predict(input_eval);
    // remove the batch dimension
    predictions = tf.squeeze(predictions, 0);
    // console.log(predictions.print());
    // predictions = predictions / temperature;
    predicted_id = tf.multinomial(predictions, num_samples=1).arraySync();
    predicted_id = predicted_id.pop()[0]; //[-1,0].numpy()
    
    input_eval = tf.tensor2d([[predicted_id]]);

    text_generated.push(idx2char[predicted_id]);
  }
  return _text+text_generated.join('')
}

/**
 * Запускаем нинициализацию автодополнения
 */
function init_autocomplete(){

  var tribute = new Tribute({

      values: function( _, cb ) {
          if (_==''){
            return [];
          }
          get_ml_answers( _, answers => cb(answers) );
      },
      menuContainer: document.getElementById("autocomplete_wrapper"),
      autocompleteMode: true,
      noMatchTemplate: "",
      lookup: 'name',
      fillAttr: 'value',
      requireLeadingSpace: false,
      menuItemTemplate: function(item) {
        return item.string;
      }
  });
  // console.log(document.getElementById("autocomplete_area"));
  tribute.attach(document.getElementById("autocomplete_area"));

}



/**
 * получаем прогнозы из модели
 */
function get_ml_answers(q, cb){
  
  let txt = generate_text(window.ml_model,q, 40);
  txt = txt.split(' ')
  txt.splice(-1,1);
  txt = txt.join(' ');
  let _ = [ { 'name': txt, 'value':txt } ];
  cb(_);
}
