"use strict"

// * Statements
const body = document.getElementById("body"),
    buttonDark = document.getElementById("buttonDark"),
    navSelect = document.getElementById("navSelect");
let data;

// * Function
const getData = async () => {
    data = await fetch("https://restcountries.com/v3.1/all")
        .then( res => {
            return res.json()
        })
        .then( res => {
            return res
        })
    console.log(data)
} 

// * Event

buttonDark.addEventListener("click", () => {
    body.classList.toggle("dark");
})

navSelect.addEventListener("click", () => {
    navSelect.children[2].classList.toggle("open");
    navSelect.children[0].classList.toggle("open");
})

getData()