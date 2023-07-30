

function removeRowByElement(array, element) {
  const rowIndex = array.findIndex(row => row.includes(element));

  if(rowIndex !== -1){
    array.splice(rowIndex, 1);
  }
  else{
    console.log(
      "couldnt find array"
    );
  }
}

new_row = ["abs", "guacs"]
new_row2 = ["csv", "gorilla"]

const userPool = [];

userPool.push(new_row);
userPool.push(new_row2);

console.log(userPool)
removeRowByElement(userPool, "gorilla")

console.log("after removal");

console.log(userPool)

