//Programmer: Diana Silvas
//The javascript page will contain all the functionality of my webpage


//this is the function called course to get the category,number, and title from the object 
//this makes use of the this keyword
function course(category){
	this.category = category.bold();//the .bold will make the category string bold on the page
}


// these are variables that will use the funtion course.
//the variable will store each class information 
var class1 = new course ("Richard Lopez "); //course 1 info
var class2 = new course ("Diana Silvas"); //course 2 info
var class3 = new course ("James Martinez"); //course 3 info


//array that will store all the course information 
let courses = [class1,class2,class3];

//use a loop to iterate through the classes to build the output
//this for loop is to loop through the courses array. It will use the length of the array courses. 
for (var i=0; i<courses.length; i++){
	
		document.getElementById("demo").innerHTML += courses[i].category +  "<br>";// this will display the course category, number, and title in the p tag
		//console.log(courses[i].category) I used this to test what was being run in the loop.
}


