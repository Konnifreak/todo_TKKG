const PORT = process.env.PORT || 3000;

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

describe('ToDo Anwendung', function () {
    it('successfully loads', function () {
        cy.visit(`http://localhost:${PORT}/todo.html`) // ändern Sie URL zu Ihrer App
    })
})

//test sucessfully rendered
describe('ToDo Anwendung', function () {
    it('Lade Startseite', function () {
        cy.visit(`http://localhost:${PORT}/todo.html`) // ändern Sie URL zu Ihrer App
        cy.contains('Todo Liste')

        let date=new Date(Date.now() + 3 * 86400000)
        let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
        let month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
        let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
        cy.get('#due').should('have.value', `${year}-${month}-${day}`)

        cy.get('#todo').should('have.value', '')
        cy.get('#status').should('have.value', '0')
        })
})

//test add todo
describe('ToDo Anwendung', function () {
    it('Füge ToDo hinzu', function () {
        let lengthBefore=0
        cy.visit(`http://localhost:${PORT}/todo.html`) // ändern Sie URL zu Ihrer App
        cy.get('#todo-list')
            .its('length')
            .then((length) => {
                lengthBefore = length
}           );
        cy.get('#todo').type('test todo')
        cy.get('#due').type('2023-11-14')
        cy.get('#status').select('0')
        cy.get('#add').click()
        cy.get('#todo-list').should('have.length', lengthBefore+1);



        
        cy.get('#todo').should('have.value', '')
        let date=new Date(Date.now() + 3 * 86400000)
        let year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
        let month = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(date);
        let day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
        cy.get('#due').should('have.value', `${year}-${month}-${day}`)
        cy.get('#status').should('have.value', '0')
    })
})

//test delete todo
describe('ToDo Anwendung', function () {
    it('Lösche ToDo', function () {
        cy.request({
            method: 'POST', 
            url: 'http://localhost:3000/todos',
            headers: headers,
            body: {
                "title": "1234566666666666",
                "due": "2023-11-14T00:00:00.000Z",
                "status": 0
            }  
        }).then((response) => {
            //get todo id
            const id = response.body._id
            cy.visit(`http://localhost:${PORT}/todo.html`)

            //click delete button within div with id todo-id
            cy.get(`#todo-${id}`).within(()=>{
                cy.contains('Button','Löschen').click()
            });
            cy.contains(`#todo-${id}`).should('not.exist');
        })
    })
})

//test edit todo
describe('ToDo Anwendung', function () {
    it('Bearbeite ToDo', function () {
        cy.request({
            method: 'POST', 
            url: 'http://localhost:3000/todos',
            headers: headers,
            body: {
                "title": "1234566666666666",
                "due": "2023-11-14T00:00:00.000Z",
                "status": 0
            }  
        }).then((response) => {
            //get todo id
            const id = response.body._id
            cy.visit(`http://localhost:${PORT}/todo.html`)
            cy.get(`#todo-${id}`)
                .first()
                .within(()=>{
                    cy.get('.edit').click()
                });

            cy.get('#todo').clear().type('test todo edited')
            cy.get('#due').clear().type('2023-11-14')
            cy.get('#status').select('1')
            cy.get('#add').click()
            cy.get(`#todo-${id}`).contains('test todo edited')
        })
    })
})

//test change status of todo
describe('ToDo Anwendung', function () {
    it('Update Status', function () {
        cy.request({
            method: 'POST', 
            url: 'http://localhost:3000/todos',
            headers: headers,
            body: {
                "title": "1234566666666666",
                "due": "2023-11-14T00:00:00.000Z",
                "status": 0
            }  
        }).then((response) => {
            //get todo id
            const id = response.body._id
            cy.visit(`http://localhost:${PORT}/todo.html`)
            cy.get(`#todo-${id}`)
                .first()
                .within(()=>{
                    cy.get('.edit').click()
                    cy.get.contains('In Bearbeitung')
                    cy.get('.edit').click()
                    cy.get.contains('Erledigt')
                    cy.get('.edit').click()
                    cy.get.contains('Offen')
                });
        })
    })
})