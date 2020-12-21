
async function load_model(){
  // console.log(tf.keras.layers.InputSpec);
    var model = await tf.loadLayersModel('model/model.json', false);
    console.log(model.summary());
    // console.log( model.predict("внго") );
    // const numLSTMLayers = model.layers.length - 1;
    // const layerSizes = [];
    // for (let i = 0; i < numLSTMLayers; ++i) {
    //   layerSizes.push(model.layers[i].units);
    // }
    // console.log(layerSizes.length === 1 ? layerSizes[0] : layerSizes );
    // console.log(model.modelTopology);
}

load_model();

var tribute = new Tribute({

    values: function( _, cb ) {
        console.log(_);
        get_ml_answers( _, answers => cb(answers) );
    },
    menuContainer: document.getElementById("autocomplete_wrapper"),
    autocompleteMode: true,
    noMatchTemplate: "",
    lookup: 'name',
    fillAttr: 'value',
    requireLeadingSpace: false,
    selectTemplate: function(item) {
          if (typeof item === "undefined") return null;
          if (this.range.isContentEditable(this.current.element)) {
            return (
              '<span contenteditable="false"><a>' +
              item.original.key +
              "</a></span>"
            );
          }

          return item.original.value;
        },
        menuItemTemplate: function(item) {
          return item.string;
        }
});
console.log(document.getElementById("autocomplete_area"));
tribute.attach(document.getElementById("autocomplete_area"));

/**
 * получаем прогнозы из модели
 */
function get_ml_answers(q){
    console.log(q);
    return [{ name: "Bob Bill", email: "bobbill@example.com" },
        { name: "Steve Stevenston", email: "steve@example.com" }]
}
