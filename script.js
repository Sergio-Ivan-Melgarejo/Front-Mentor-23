"use strict"

// * Statements
const body = document.getElementById("body"),
    buttonDark = document.getElementById("buttonDark"),
    navSelect = document.getElementById("navSelect"),
    navRegion = document.getElementById("navRegion"),
    flagsContainer = document.getElementById("flagsContainer"),
    loader = document.getElementById("loader"),
    main = document.getElementById("main"),
    backButton = document.getElementById("backButton"),
    infoFlag = document.getElementById("infoFlag"),
    navSearch = document.getElementById("search"),
    ContainerBorderCountries = document.getElementById("ContainerBorderCountries");
let dataFlags,
    memorizeFlag,
    memorizeRegion = document.querySelector(".nav__li-0"),
    dataFlagsFilter;

// * Function

const getData = async () => {

    return await fetch("https://restcountries.com/v2/all")
        .then( res => {
            return res.json()
        })
        .then( res => {
            return res
        })
} 

const createFlag = obj => {
    const flag = document.createElement("div");
    const img = document.createElement("img");
    const div = document.createElement("div");
    const h2 = document.createElement("h2");
    const p = document.createElement("p");
    const modal = document.createElement("div");
    
    flag.classList.add("flag");
    img.classList.add("flag__img");
    div.classList.add("flag__div");
    h2.classList.add("flag__h2");
    p.classList.add("flag__p");
    modal.classList.add("flag__modal");

    modal.setAttribute("data-name", obj.name);
    img.setAttribute( "src", obj.img );
    img.setAttribute("alt", `${obj.name} flag`);
    h2.textContent = obj.name;
    p.innerHTML = `
                    Population: <span class="flag__span">${obj.population}</span><br>
                    Region: <span class="flag__span">${obj.region}</span><br>
                    Capital: <span class="flag__span">${obj.capital}</span><br>
                `;
    flag.setAttribute("data-region", obj.region);

    flag.appendChild(img);
    div.appendChild(h2);
    div.appendChild(p);
    flag.appendChild(div);
    flag.appendChild(modal);

    // flagsContainer.appendChild(flag)
    return flag;
}

const loaderToggle = () => {
    loader.classList.toggle("open");
}

const loadFlags = async (  ) => {
    dataFlags = await getData();
    
    let fragment = document.createDocumentFragment();
    dataFlags.forEach( element => {
        let obj = {},
            name;

        obj.region = element.region;
        obj.img = element.flags.png;
        obj.region = element.region;

        name = element.name;
        if( name.includes("(") ) {
            let index = name.indexOf("(");
            name = name.slice( 0 , index );
            name = name.trim(); 
        }
        obj.name = name;

        obj.population = new Intl.NumberFormat().format(element.population);

        ( element.capital !== undefined ) ? obj.capital = element.capital : obj.capital = "none";
        
        fragment.appendChild( createFlag(obj) );
    });
    flagsContainer.appendChild(fragment);

    loaderToggle();
}

const selecFlag = (element) => {
    loaderToggle();

    let name = element.getAttribute("data-name");

    if ( memorizeFlag !== name ) {  
        
        fetch(`https://restcountries.com/v2/name/${name}`)
            .then( res => {
                return res.json()
            })
            .then( res => {
                let x = infoFlag.children[1],
                    currencies,          
                    languages = [],
                    countries = [];

                // img - flag
                infoFlag.children[0].setAttribute( "src" , res[0].flags.png );

                // child 0 - title - name
                x.children[0].textContent = res[0].name;

                // child 1 - subInfo 1
                x.children[1].children[0].textContent = res[0].nativeName;
                x.children[1].children[2].textContent = new Intl.NumberFormat().format(res[0].population);
                x.children[1].children[4].textContent = res[0].region ;
                x.children[1].children[6].textContent = res[0].subregion ;
                x.children[1].children[8].textContent = res[0].capital;

                // child 2 - subInfo 2
                x.children[2].children[0].textContent = res[0].topLevelDomain.join(", ");
                for ( let element in res[0].currencies){
                    if ( currencies !== undefined ) currencies += `,  ${res[0].name.currencies[element].name}`;
                    currencies = res[0].currencies[element].name;
                }
                x.children[2].children[2].textContent = currencies;
                for ( let element of res[0].languages ){
                    languages.push(element.name)
                }
                x.children[2].children[4].textContent = languages.join(", ");

                // child 3 - border countries
                if ( res[0].borders !== undefined ){
                    for ( let country of res[0].borders ) {
                        countries.push(country)
                    }
                    insertBorderCountries(countries);
                }
                else {
                    ContainerBorderCountries.removeChild( ContainerBorderCountries.children[1] );
                     
                    const spanContainer = document.createElement("span");
                    spanContainer.classList.add("box-2__country");
                    spanContainer.id = "borderCountries";

                    ContainerBorderCountries.appendChild(spanContainer);

                    const span = document.createElement("span");
                    span.classList.add("box-2__a");
                    span.textContent = "none";

                    document.getElementById("borderCountries").appendChild(span);
                }

                loaderToggle();
            })
    }
}

const getFullName = async (country) => {
    let name = dataFlags.filter( element => ( element.alpha3Code == country || element.alpha2Code == country ));
    name = name[0].name;

    if( name.includes("(") ) {
        let index = name.indexOf("(");
        name = name.slice( 0 , index );
        name = name.trim(); 
    }

    return name
}

const insertBorderCountries = async (array) => {
    let name;

    ContainerBorderCountries.removeChild( ContainerBorderCountries.children[1] );

    const spanContainer = document.createElement("span");
    spanContainer.classList.add("box-2__country");
    spanContainer.id = "borderCountries";

    ContainerBorderCountries.appendChild(spanContainer);

    for ( let i = 0; i < array.length; i++ ) {
        name = await getFullName(array[i]);

        const span = document.createElement("span");
        span.classList.add("box-2__a");  
        span.textContent = name;
        span.setAttribute("data-name", name);

        document.getElementById("borderCountries").appendChild(span);
    }
}

const filter = () => {
    let region = navRegion.textContent;
    let search = navSearch.value.toLocaleLowerCase();

    // Region
    if ( region == "America" ) region = "Americas"; 

    if ( region == "Filter by Region" ) {
        for ( let i = 0; i < flagsContainer.children.length; i++ ) {
            flagsContainer.children[i].classList.remove("filter");
        }
    }
    else {
        for ( let i = 0; i < flagsContainer.children.length; i++ ) {
            ( flagsContainer.children[i].getAttribute("data-region") == region ) ? flagsContainer.children[i].classList.remove("filter") : flagsContainer.children[i].classList.add("filter")
        }
    }

    // Search
    for ( let i = 0; i < flagsContainer.children.length; i++ ){
        let flag = flagsContainer.children[i];
        if ( !flag.classList.contains("filter") ){
            (flag.children[2].getAttribute("data-name").toLocaleLowerCase().includes( search )) ? flag.classList.remove("filter") : flag.classList.add("filter");
        }
    }
}

// modo dark?
const localstorage = () => {
    let dark = localStorage.getItem("dark-mode");
    if ( dark ){
        body.classList.add("dark");
        buttonDark.children[1].textContent = "Light Mode";
        buttonDark.children[0].classList.remove("fa-moon");
        buttonDark.children[0].classList.add("fa-sun");
    }
}

// * Event

addEventListener("DOMContentLoaded", () => {
    loadFlags();

    navSelect.addEventListener("click", (e) => {
        if ( !e.target.classList.contains("nav__ul") ) {
            navSelect.children[0].classList.toggle("open");
            navSelect.children[1].classList.toggle("open");
            navSelect.children[2].classList.toggle("open");

            if ( e.target.classList.contains("nav__li") ) {
                e.target.classList.add("select");
                memorizeRegion.classList.remove("select");
                navRegion.textContent = e.target.textContent;
                memorizeRegion = e.target;

                filter();
            }
        }
    })

    flagsContainer.addEventListener("click", (e) => {

        if ( e.target.classList.contains("flag__modal") ) {

            main.children[0].classList.remove("open");
            main.children[1].classList.add("open");

            selecFlag( e.target );
        }
    })

    backButton.addEventListener("click", () => {
        main.children[0].classList.add("open");
        main.children[1].classList.remove("open");
    })
    
    ContainerBorderCountries.addEventListener("click", (e) => {
        if ( e.target.classList.contains("box-2__a") && e.target.textContent != "none" ) {
            selecFlag(e.target);
        }
    })

    navSearch.addEventListener("keyup", (e) => {
        filter();
    })
    
})

buttonDark.addEventListener("click", () => {
    if ( body.classList.contains("dark") ) {
        body.classList.remove("dark");
        buttonDark.children[1].textContent = "Dark Mode";
        buttonDark.children[0].classList.remove("fa-sun");
        buttonDark.children[0].classList.add("fa-moon");

        localStorage.removeItem("dark-mode");
    }
    else {
        body.classList.add("dark");
        buttonDark.children[1].textContent = "Light Mode";
        buttonDark.children[0].classList.remove("fa-moon");
        buttonDark.children[0].classList.add("fa-sun");

        localStorage.setItem("dark-mode", true);
    }
})

// self-execute
localstorage()