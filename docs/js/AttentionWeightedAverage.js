
/**
 * This custom layer is similar to the 'relu' non-linear Activation `Layer`, but
 * it keeps both the negative and positive signal.  The input is centered at the
 * mean value, and then the negative activations and positive activations are
 * separated into different channels, meaning that there are twice as many
 * output channels as input channels.
 *
 * Implementing a custom `Layer` in general involves specifying a `call`
 * function, and possibly also a `computeOutputShape` and `build` function. This
 * layer does not need a custom `build` function because it does not store any
 * variables.
 *
 * Custom layers currently can not be saved / loaded.  Tracking issue at
 * https://github.com/tensorflow/tfjs/issues/254
 */
// import { InputSpec } from '@tensorflow/tfjs-layers/dist/engine/topology';

class AttentionWeightedAverage extends tf.layers.Layer {
    constructor(return_attention=False) {
      super({});
      // TODO(bileschi): Can we point to documentation on masking here?
      this.supportsMasking = true;
      this.return_attention = return_attention;
    }

    build(inputShape) {
        this.inputSpec = [ new keras.layers.InputSpec({ndim:3})]
        // assert len(inputShape) == 3

        this.W = this.add_weight(shape=(inputShape[2], 1),
                                 name=this.name+'_W',
                                 trainable=true,
                                 initializer=this.init);
        this.built = true;
        // super(AttentionWeightedAverage, this).build(inputShape)
    }
  
    /**
     * This layer only works on 4D Tensors [batch, height, width, channels],
     * and produces output with twice as many channels.
     *
     * layer.computeOutputShapes must be overridden in the case that the output
     * shape is not the same as the input shape.
     * @param {*} inputShapes
     */
    computeOutputShape(inputShape) {
      return [inputShape[0], inputShape[1], inputShape[2], 2 * inputShape[3]]
    }
  
    /**
     * Centers the input and applies the following function to every element of
     * the input.
     *
     *     x => [max(x, 0), max(-x, 0)]
     *
     * The theory being that there may be signal in the both negative and positive
     * portions of the input.  Note that this will double the number of channels.
     * @param inputs Tensor to be treated.
     * @param kwargs Only used as a pass through to call hooks.  Unused in this
     *   example code.
     */
    call(inputs, kwargs) {
      let input = inputs;
      if (Array.isArray(input)) {
        input = input[0];
      }
      this.invokeCallHook(inputs, kwargs);
      const origShape = input.shape;
      const flatShape =
          [origShape[0], origShape[1] * origShape[2] * origShape[3]];
      const flattened = input.reshape(flatShape);
      const centered = tf.sub(flattened, flattened.mean(1).expandDims(1));
      const pos = centered.relu().reshape(origShape);
      const neg = centered.neg().relu().reshape(origShape);
      return tf.concat([pos, neg], 3);
    }
  
    /**
     * If a custom layer class is to support serialization, it must implement
     * the `className` static getter.
     */
    static get className() {
      return 'AttentionWeightedAverage';
    }
  }

tf.serialization.registerClass(AttentionWeightedAverage);  // Needed for serialization.

function attentionweightedaverage() {
    return new AttentionWeightedAverage();
}