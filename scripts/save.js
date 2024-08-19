let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
export default function SaveCodeGeneration(stringified){
    let data = stringified.parse();
    let code = "";
    for (var key in data) {
        code.concat(data[key]+alphabet[key]);
    }
}

