const signIn = (data) => {
    
    return new Promise(resolve => {
        setTimeout(() => {
            console.log(data);
            resolve({
                token: 'idaosfu90813y4rhfuasdbf87tg123ddsaf',
                user: {
                    name: 'William',
                    email: 'contato.williamc@gmail.com',
                    cpfCnpj: '111.111.111-11',
                    phone: '(47) 98408-8520',                    
                },
            });
        }, 1000);
    });
};

const signUp = (data) => {
    setTimeout(() => {
        console.log(data);    
    }, 500);    
};

export {signIn, signUp};