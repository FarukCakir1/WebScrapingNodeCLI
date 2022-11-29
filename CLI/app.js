import axios from "axios"
import chalk from "chalk"
import chalkanim from "chalk-animation"
import cheerio from "cheerio"
import inquirer from "inquirer"
import { createSpinner } from "nanospinner"

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms))

let allDatas = {
    product_name: "",
    Trendyol: {},
    Hepsiburada: {},
    N11: {}
}


let choices = [
    {
        name: "Trendyol",
        completed: false
    },
    {
        name: "Hepsiburada",
        completed: false
    },
    {
        name: "N11",
        completed: false
    }
]


const Welcome = async () => {
    const welcomeMessage = chalkanim.neon("ÜRÜN EKLEME PANELİNE HOŞGELDİNİZ... \n")

    await sleep()
    welcomeMessage.stop()

    console.log(`
    ${chalk.bgBlue.red("NASIL ÇALIŞIR ?")}\n\n
    ${chalk.blue(` Ürün karşılaştırması yaptığımız 3 farklı e-ticaret sitesi bulunur. Bunlar sırasıyla;
    -Trendyol\n
    -HepsiBurada\n
    -N11\n

    `)}
   
    `)

    selectAsite()

}

const selectAsite = async () => {
    
    const answers = await inquirer.prompt({
        name: 'Sites',
        type: 'list',
        message: 'Bir E-ticaret uygulaması seçin',
        choices: choices.map(choice => {
            if(choice.completed === true){
                return chalk.green(choice.name)
            }else {
                return choice.name
            }
            
        })
    })
    
    return handleAnswer(answers.Sites)
} 

const handleAnswer = async (answer) => {
    const spinner = createSpinner('Yükleniyor...').start()
    await sleep()
    spinner.stop()
    

    const productName = await inquirer.prompt({
        name: "product-name",
        type: "input",
        message: "Ürün İsmi"
    })

    choices.map(choice => {
        if(choice.name === answer){
            return choice.completed = true
        }
        return choice
    })

    return handleAPIReq(productName["product-name"], answer)
} 

const endOfRun = async () => {
    const endOrContinue = await inquirer.prompt({
        name: "end-or-continue",
        type: "confirm",
        message: chalk.blue("İşlem Tamamlandı Yeni İşlem yapmak istermisiniz")
    })

    return handleProgramEnd(endOrContinue["end-or-continue"])
}

const handleProgramEnd = async (answer) => {
    if(answer === true){
        choices = choices.map(choice => {
            choice.completed = false
            return choice
        })
        axios.post("http://localhost:3050/products", allDatas)
            .then(response => {
                console.log(`Ürün Yükleme Başarılı ${response.data}`)
                allDatas = {}
                selectAsite()
            })
        
    }else{
        axios.post("http://localhost:3050/products", allDatas)
            .then(response => {
                console.log(`Ürün Yükleme Başarılı ${response.data}`)
                process.exit()
            })
    }
}


const handleAPIReq = async (name, selection) => {
    
    allDatas.product_name = name.toLowerCase()

    if(selection === "Trendyol"){
        const product = await dataStructureForTrendyol(`https://www.trendyol.com/sr?q=${name}`)
        allDatas.Trendyol = product
    }   
    if(selection === "Hepsiburada"){
        const product = await dataStructureForHepsiburada(`https://www.hepsiburada.com/ara?q=${name}`)
        allDatas.Hepsiburada = product
    }
    if(selection === "N11"){
        const product = await dataStructureForN11(`https://www.n11.com/arama?q=${name}`)
        allDatas.N11 = product
    }
    
    console.log(allDatas)

    if(choices.filter(choice => choice.completed === false).length !== 0){
        selectAsite()
    }else{
        endOfRun()
    }
    
}

const dataStructureForTrendyol = async (url) => {
    let prices = []
    let name = ""
    let res = await axios.get(url)
    let $ = await cheerio.load(res.data)
    $(
        ".prc-box-dscntd"
    ).each((i, e) => {
        prices.push(e.children[0].data)
    })
    $(
        ".prdct-desc-cntnr-name"
    ).each((i, e) => {
        if(i === 0){
            name = e.children[0].data
        }
    })

    const product = {
        name: name,
        img: "",
        price: prices[0]
    }
    return product
}

const dataStructureForHepsiburada = async (url) => {

    let price = ""
    let img = ""
    let name = ""
    const res = await axios.get(url)
    let $ = await cheerio.load(res.data)

    // for get titles' dynamic class
    let allNameResults = []
    $(
        "h3"
    ).each((i,e) => {
        if(e.attribs.class !== undefined){
            allNameResults.push(e.attribs.class)
        }
        
    })
    // get all titles by dynamic class
    $(
        `.${allNameResults.map(i => i.split(" ")[0])}`
    ).each((i,e) => {
        if (i === 0) {
            name = e.children[0].data
        }

    })
    // for get images' dynamic class
    let allImgResults = []
    $(
        "img"
    ).each((i,e) => {
        if(e.attribs.class !== undefined){
            allImgResults.push(e.attribs.class)
        }
        
        
    })
    // for get all image src
    $(
        `.${allImgResults.map(i => i.split(" ")[0])}`
    ).each((i,e) => {
        if(i === 0){
            img = e.attribs.src
            return
        }
        
    })
    let allPriceResults = []
    // for get all prices' dynamic class by data-test-id attributes
    $(
        "a > div > div"
    ).each((i, e) => {
            if(e.attribs["data-test-id"] === "price-current-price"){
                allPriceResults.push(e.attribs.class)
            }
    })

    $(
        `.${allPriceResults.map(i => i.split(" ")[0])}`
    ).each((i,e) => {
        if(i === 0){
            price = e.children[0].data
            return
        }
        
    })

    const product = {
        name: name,
        img: img,
        price: price
    }
    
    return product
    
}

const dataStructureForN11 = async (url) => {

    let price = ""
    let img = ""
    let name = ""

    const res = await axios.get(url)
    const $ = await cheerio.load(res.data)

    $(
        ".productName"
    ).each((i, e) => {
        if(i === 0){
            name = e.children[0].data
            return
        }
        
    })

    $(
        ".cardImage"
    ).each((i, e) => {
        if(i === 0){
            img = e.attribs.src
            return
        }
    })

    $(
        "ins"
    ).each((i, e) => {
        if(i === 0){
            price = e.children[0].data
            return
        }
    })

    const product = {
        name: name,
        img: img,
        price: price
    }
    return product
}


Welcome()