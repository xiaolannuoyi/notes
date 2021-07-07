



```html
<template>
  <div class="codemirror">
    <codemirror
      v-model="code"
      :options="{
        tabSize: tabSize,
        mode: mode,
        lineNumbers: lineNumbers,
        readOnly: readOnly,
        theme: theme
      }"
      :class="['code', height ? 'height-code' : '', readOnly ? 'readOnly' : '']"
    ></codemirror>
  </div>
</template>

<script>
import { codemirror } from "vue-codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/night.css";
const requireAll = requireContext => requireContext.keys().map(requireContext);
const req = require.context("codemirror/mode", true, /\.js$/);
requireAll(req);
export default {
  name: "agree-code-mirror",
  components: {
    codemirror
  },
  props: {
    codedata: String,
    tabSize: {
      type: Number,
      default: 4
    },
    mode: {
      type: String,
      default: ""
    },
    theme: {
      type: String,
      default: "default"
    },
    fontColor: {
      type: String,
      default: ""
    },
    //是否显示行号
    lineNumbers: {
      type: Boolean,
      default: true
    },
    //是否只读
    readOnly: {
      type: [String, Boolean],
      default: true //"nocursor"
    },
    //是否限制高度
    height: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      code: this.codedata
    };
  },
  watch: {
    code(val) {
      this.$emit("update:codedata", val);
    },
    codedata(val) {
      this.code = val;
    }
  },

  methods: {},
  mounted() {}
};
</script>
<style>
.code .CodeMirror {
  width: 100%;
  height: auto;
}
.height-code .CodeMirror {
  height: 500px !important;
}
.readOnly .CodeMirror-cursors {
  visibility: hidden !important;
}
</style>

```

