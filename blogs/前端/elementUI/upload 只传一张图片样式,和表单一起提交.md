---
title: upload 只传一张图片样式,和表单一起提交
date: 2019-10-26
sidebar: 'auto'
sidebarDepth: 2
categories:
 - 前端
tags:
 - elementUI
 - csdn
prev: false
next: upload 只上传单个文件，并覆盖
---

# 只传一张图片样式,上传一张后不再显示加号
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191025232927204.gif)

```html
<template>
  <div>
    <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          :class="{ disabled: uploadDisabled }"
          list-type="picture-card"
          :limit="limitcount"
          :on-change="handleChange"
          :on-remove="handleRemove"
          :auto-upload="false"
          accept="image/*"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
  </div>
</template>

<script>
export default {
  data() {
    return {
      uploadDisabled: false,
      limitcount: 1
    };
  },
  methods: {
    handleChange(file, fileList) {
      this.uploadDisabled = fileList.length >= this.limitcount;
      console.log("this.uploadDisabled", this.uploadDisabled);
    },
    handleRemove(file, fileList) {
      this.uploadDisabled = fileList.length >= this.limitcount;
      console.log("this.uploadDisabled", this.uploadDisabled);
    }
  }
};
</script>

<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>
```

| 参数                      | 解读                                                         |
| ------------------------- | ------------------------------------------------------------ |
| :on-change="handleChange" | 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用。这里用来通过文件个数来判断是否显示加号样式 |
| :on-remove="handleRemove" | 移除时 ,加号样式.                                            |

>action="https://-----" 这里要你的上传地址是对的,图片才能显示
>`:auto-upload="false"` 取消立即上传,就不会走action的上传地址.图片也可以显示的

limitcount 限制上传数量
limitcount:2时的运行图
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191025235123309.gif)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191025235144551.gif)
# 图片和表单一起提交
![在这里插入图片描述](https://img-blog.csdnimg.cn/20191026001456986.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzMxMTI2MTc1,size_16,color_FFFFFF,t_70)
```html
<template>
  <div>
    <el-form ref="ruleForm" label-width="80px" :model="form" :rules="rules" v-loading="loading">
      <el-form-item label="模版名称" prop="templatename">
        <el-input v-model="form.templatename"></el-input>
      </el-form-item>
      <el-form-item label="模版图片" prop="file">
        <el-upload
          action="a"
          ref="upload"
          :class="{ disabled: uploadDisabled }"
          list-type="picture-card"
          :limit="1"
          :on-change="handleChange"
          :on-remove="handleRemove"
          :auto-upload="false"
          accept="image/*"
        >
          <i class="el-icon-plus"></i>
          <div slot="tip" class="el-upload__tip">只能上传图片文件，且不超过100kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        templatename: "",
        file: ""
      },
      rules: {
        templatename: [{ required: true, message: "请输入正确的信息", trigger: "blur", pattern: /^[A-Za-z0-9]+$/ }],
        file: [{ required: true, message: "请上传文件", trigger: "blur" }]
      },
      loading: false,
      uploadDisabled: false,
    };
  },
  methods: {
    handleChange(file, fileList) {
      if (file.size > 1024 * 100) {
        this.$refs.upload.clearFiles();
        this.uploadDisabled = false;
        this.$message({
          message: "上传图片大小不能超过 100kb!",
          type: "error"
        });
      } else {
        this.uploadDisabled = fileList.length >= 1;
        this.form.file = file.raw; //将上传文件付给表单的字段
      }
    },
    handleRemove(file, fileList) {
      console.log("handleRemove", file);
      this.uploadDisabled = fileList.length >= 1;
    },
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.loading = true;
          console.log('提交请求--代码')
          this.loading = false;
        } else {
          return false;
        }
      });
    },
    reset() {
      this.$refs.upload.clearFiles();
      this.uploadDisabled = false;
      this.$refs.ruleForm.resetFields();
    }
  },
};
</script>

<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>
```

1. `:auto-upload="false"` 取消立即上传
2. 重置时,要清空表单,清空图片.
3. `:on-change="handleChange"` 做文件大小判断

# 图片上传后,回显
` :file-list="filelist"`
回显数据内容
```js
this.filelist = [{ name: '*****', url: '*****'}];
this.uploadDisabled = true;
```

[vue-running在线运行地址](https://xiaolannuoyi.github.io/vue-running/#/runningcode/element/upload-img)