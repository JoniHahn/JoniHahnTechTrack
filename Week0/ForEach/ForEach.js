/*  The following array contains multiple elements.
    create one String with all the elements of the Array and log it to the console */

    const data = [
        "HTML",
        "CSS",
        "XML",
        "JSON",
        "Javascript"
    ]
    
    let languages = " "

    function convertToString() {
        /* Your code here should return to the console one String containing all the elements of array data . */
        data.forEach(language => {
            languages += language + " "
        })

    }
    
    convertToString()

    console.log(languages)