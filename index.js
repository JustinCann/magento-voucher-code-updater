// --------------------------------------------------
// Modules
// --------------------------------------------------
//
import Enquirer from 'enquirer';

import fs from 'fs';
import chalk from 'chalk';

// --------------------------------------------------
// Constants and Variables
// --------------------------------------------------
//

const enquirer = new Enquirer();

const startingIndex = 473;
const destinationFile = '';
const log = console.log;

// --------------------------------------------------
// Methods
// --------------------------------------------------
//

enquirer.question('codesFile', {
    message: chalk.white('Entire the name of the file containing the new codes'),
    default: 'codes.txt'
});

enquirer.question('fileName', {
    message: chalk.white('What should we name this new file'),
    default: 'voucherScript' + Math.floor((Math.random() * 1000) + 1) + '.sql'
});

enquirer.prompt(['codesFile', 'fileName']).then((answers) => {
    readAnswers(answers);
});

/**
* Processes the answers and sends them create SQL scripts function
* @param {Object} answers answers from the prompt
*/
const readAnswers = (answers) => {

    let {codesFile, fileName} = answers

    let codes;

    fs.readFile(codesFile, (err, data) => {
        if (err) throw err;
        codes = data.toString().trim().split("\n");
        createSQLScripts(codes, fileName);
    });

}

/**
 * Creates the voucher code update scripts
 * @param {array} codes codes from code text file
 * @param {string} fileName file name of the new file
 */
const createSQLScripts = (codes, fileName) => {

    let total = codes.length; // total number of codes to update

    log(chalk.blue(`This script updates ${total} codes starting at index ${startingIndex}. \n`));

    let newFile = fs.createWriteStream(fileName, {
        flags: 'a' // preserved existing data
    }); // create new file

    [].forEach.call(codes, (code, index) => {

        let coupon_id = startingIndex + index;

        let update = "UPDATE `biggiebe_biggie_best`.`salesrule_coupon` SET `code` = '" + code + "', `expiration_date` = NULL WHERE `salesrule_coupon`.`coupon_id` =" + coupon_id + ";\n"

        newFile.write(update);

    });

    checkFile(fileName);

}

/**
* Checks the newly generate file
* @param {string} fileName file name of newly created script
*/
const checkFile = (fileName) => {

    // make sure file created successfully
    if (fs.existsSync(fileName)) {
        log(chalk.green('scripts created successfully :D'));
        log(chalk.green(`${fileName} contains your scripts.`));
    } else {
        log(chalk.red('script generation failed :('));
        log(chalk.red("Don't forget to run " + chalk.white.underline.bold('npm install')));
        log(chalk.red("Try again"));
    }
}
