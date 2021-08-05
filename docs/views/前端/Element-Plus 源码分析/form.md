---
title: form
date: 2021-07-22
sidebar: 'auto'
sidebarDepth: 2
categories:
    - Element-Plus 源码分析
tags:
    - Element-Plus 源码分析
---

# form

1. 结构

   ```html
   <el-form>
   	<el-form-item></el-form-item>
   </el-form>
   ```

   `El-form` 有slot ，且绑定了 数据，以及rules

   `el-form-item`  有slot ，label，prop等

   

2. 校验流程

   ```html
   <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef">
     <el-form-item label="活动名称" prop="name">
       <el-input v-model="ruleForm.name"></el-input>
     </el-form-item>
     <el-form-item label="即时配送" prop="delivery">
       <el-switch v-model="ruleForm.delivery"></el-switch>
     </el-form-item>
   </el-form>
   ```

   * 首先`:model="ruleForm" :rules="rules"` 都是绑定到`<el-form>`上的，`<el-form-item>`是有单个校验方法。`</el-input>`上直接绑定了数据`v-model="ruleForm.name"`,但是如何触发上层组件`<el-form-item>`的校验方法

     首先 `<el-form>` 要将`rules` 传给`<el-form-item>`,以及

     

     >

   * 

   

3. 
