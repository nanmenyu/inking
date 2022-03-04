<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { db } from './db/db';
// import axios from 'axios';
db.user.where(':id').between(1, Infinity).toArray().then(value => {
  console.log(value);
  if (value.length === 0) {
    db.user.add({
      creationTime: new Date().getTime(),
      creationYear: new Date().getFullYear(),
      creationMonth: new Date().getMonth() + 1,
      creationDay: new Date().getDate(),
      codewords: 0
    });
  } else {

  }
})
// axios.get('http://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp', {
//   headers: {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json',
//     'Access-Control-Allow-Origin': '*',
//   },
// })
//   .then(res => {
//     alert(res.data.data.t);
//     console.log(res.data.data.t);
//   })
console.log(new Date().getTime());
console.log(new Date().getFullYear());
console.log(new Date().getMonth() + 1);
console.log(new Date().getDate());


</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #333333;
}
</style>
