/*  The following array contains strings with randomized capitals.
    You're tasked with converting all strings to lowercase with a
    first letter capitalized */

    const data = [
        "robert",
        "vincent",
        "lAuRa",
        "Danny",
        "bERRY",
        "rOOs"
    ];
    
    /* This should the result be:
    
        const data = [
            "Robert",
            "Vincent",
            "Laura",
            "Danny",
            "Berry",
            "Roos"
        ];
    
    */
    

    function convertArrayStringsToCapitalized(myData) {
        
        /* Your code here should convert an array myData to a normalized array ad specified above and return the result*/
        return myData.map(person => {
            return person.charAt(0).toUpperCase() + person.slice(1).toLowerCase()
        })
    }
    
    const resultaat = convertArrayStringsToCapitalized(data)

console.log(resultaat);