/*  This array of objects contains some weird data, and some useless points,
    You're tasked in transforming and normalizing this data to the second
    example */

    const data = [
        {
            name: "robert",
            age: "29",
            residence: "amsterdam",
            curriculum: ["Deloitte", "Hogeschool van Amsterdam", "DEPT"]
        },
        {
            name: "berend",
            age: "32",
            residence: "rotterdam",
            curriculum: ["DEPT", "GRRR"]
        },
        {
            name: "ubaida",
            age: "26",
            residence: "Amersfoort",
            curriculum: ["Clarify"]
        }
    ];
    
    
    /* Normalize capitals in names, convert ages to numbers, extract current employer from curriculum.
    
        const data = [
            {
                name: "Robert",
                age: 29,
                employer: "Deloitte"
            },
            {
                name: "Berend",
                age: 32,
                employer: "DEPT"
            }
            {
                name: "Ubaida",
                age: "26",
                employer: "Clarify"
            }
        ];
    
    */
    
    function transformArrOfObj(myObj) {
        /* Write your functionality here and return the result */
        let result = []

        data.forEach(person => {
            const personData = {
                name : person.name.charAt(0).toUpperCase() + person.name.slice(1).toLowerCase(), 
                age : Number(person.age),
                curriculum : person.curriculum[0]
            }
            result.push(personData)
        })
        return result
    }

    console.log(transformArrOfObj(data))
    
    /* log the transformed data-array to the console*/