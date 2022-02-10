### Dexie.js API快速入门

https://dexie.org/docs/API-Reference

#### 声明数据库

```javascript
var db = new Dexie("MyDatabase");
db.version(1).stores({
    friends: "++id, name, age, *tags",
    gameSessions: "id, score"
});
```

**注意：不要像在 SQL 中那样声明所有列。您只声明要索引的属性,即要在 where(...) 查询中使用的属性。**

#### 模式语法

| ++    | 自增主键             |
| ----- | :------------------- |
| &     | 独一无二的(比如主键) |
| *     | 多条目索引           |
| [A+B] | 复合索引             |

可声明索引类型包括：
	string  number  Date  ArrayBuffer
	Typed arrays (Uint8Array, Float32Array, …, etc)
    arrays of (strings, numbers, Dates, ArrayBuffer, Typed array) or a mix of those.

不可声明索引类型包括：
	boolean
	undefined
	Object
	null

#### 升级

```javascript
db.version(1).stores({
    friends: "++id,name,age,*tags",
    gameSessions: "id,score"
});

db.version(2).stores({
    friends: "++id, [firstName+lastName], yearOfBirth, *tags", // 索引改变
    gameSessions: null // 删除了gameSessions表（仓库）

}).upgrade(tx => {
    // Will only be executed if a version below 2 was installed.
    return tx.table("friends").modify(friend => {
        friend.firstName = friend.name.split(' ')[0];
        friend.lastName = friend.name.split(' ')[1];
        friend.birthDate = new Date(new Date().getFullYear() - friend.age, 0);
        delete friend.name;
        delete friend.age;
    });
});
```

#### 添加项目

```javascript
 db.friends.add({name: "Josephine", age: 21});// 单添加

// 多项目添加
 db.friends.bulkAdd([
  {name: "Foo", age: 31},
  {name: "Bar", age: 32}
]);
```

#### 更新项目

```javascript
// 覆盖更新-主键为4的项目的内容
// 省略主键id时会向add一样添加一个新项目
 db.friends.put({id: 4, name: "Foo", age: 33});
// 多项目更新
 db.friends.bulkPut([
    {id: 4, name: "Foo2", age: 34},
    {id: 5, name: "Bar2", age: 44}
]);

// 不覆盖更新-主键为8的name数据
 db.friends.update(8, {name: "Bar"});
// 查询条件'age',inAnyRange设置年龄区间,按条件查询,为他们添加项目discount: 0.5
 db.friends
    .where("age")
    .inAnyRange([ [0, 18], [65, Infinity] ])
    .modify({discount: 0.5});
```

#### 通过主键查询
```javascript
// 查询id为1的item
db.friends.get(1)
    .then((user) => {
    console.log(user);
});

// 全表查询
db.friends.where(':id').between(1, Infinity).toArray().then(value => {
    console.log(value)
})
```
### 通过主键删除
```javascript
//Delete items
await db.friends.delete(4);
await db.friends.bulkDelete([1,2,4]);

const oneWeekAgo = new Date(Date.now() - 60*60*1000*24*7);

await db.logEntries
    .where('timestamp').below(oneWeekAgo)
    .delete();
```
