---
title: upload 只上传单个文件，并覆盖
date: 2020-08-18
sidebar: 'auto'
sidebarDepth: 2
categories:
 - 前端
tags:
 - elementUI
 - csdn
prev: upload 只传一张图片样式,和表单一起提交
next: false
---

[vue-running 在线运行地址](https://xiaolannuoyi.github.io/vue-running/#/runningcode/element/uplod-file)
```html
<template>
  <div style="width:500px">
    <el-upload
      class="upload-demo"
      drag
      action=""
      multiple
      :file-list="fileList"
      :auto-upload="false"
      :on-change="handleChange"
      :on-remove="handleRemove"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
      <div class="el-upload__tip" slot="tip">
        上传文件，且不超过500kb
      </div>
    </el-upload>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: [],
      file: ""
    };
  },
  methods: {
    handleChange(file, fileList) {
      if (file.size > 1024 * 500) {
        fileList.pop();
        this.$message({
          message: "单个文件不超过20M!",
          type: "error"
        });
      } else {
        this.fileList = [fileList[fileList.length - 1]]; // 覆盖
        this.file = file.raw;
      }
    },
    handleRemove(file, fileList) {
      this.fileList = [];
      this.file = "";
    }
  }
};
</script>

<style scoped></style>

```

[其他文章——element upload 只传一张图片样式,和表单一起提交](https://blog.csdn.net/qq_31126175/article/details/102745994)