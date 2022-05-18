/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { ROUTES, ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import user from '@testing-library/user-event'
import userEvent from '@testing-library/user-event'
import mockStore from "../__mocks__/store"
import router from "../app/Router.js";

jest.mock("../app/store", () => mockStore)
describe("Given I am connected as an employee", async() => {
  
  const onNavigate = (pathname) => {
    document.body.innerHTML = ROUTES({ pathname })
  }
  beforeEach(() => {
    document.body.innerHTML = ''
    jest.spyOn(mockStore, "bills")
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
  })
  describe("When I am on NewBill Page", () => {
    test("Then form should be displayed", async () => {
      //to-do write assertion
      window.onNavigate(ROUTES_PATH.NewBill)
      
      const html = NewBillUI()
      document.body.innerHTML = html
      await waitFor(() => screen.getByTestId('form-new-bill'))
      const form = screen.getByTestId('form-new-bill')
      expect(form).toBeTruthy()
    })
  })
  describe("When I handle a file", () => {
    test("Then the extension is wrong", async () => {
      
      const newbillContainer = new NewBill({document, onNavigate, store: null, localStorage: window.localStorage })
      const testHandleFile = jest.fn((e) => newbillContainer.handleChangeFile(e))
      const inputFile = screen.getByTestId('file');
      const file = new File(['blob'], 'blob.pdf', {
        type: 'application/pdf',
      });
      
      /* const form = screen.getByTestId('form-new-bill')
      const testHandleSubmit = jest.fn((e) => newbillContainer.handleSubmit(e))
      form.addEventListener('submit', testHandleSubmit) */
      inputFile.addEventListener("change", testHandleFile)

      user.upload(inputFile, file);

      await waitFor(() => screen.getByTestId('error-file'))
      const error = screen.getByTestId('error-file')
      console.log('error message', document.body)
      expect(!error.classList.contains('message-ok')).toBe(true)
/* 
      const newFile = new File(['image'], 'test.png', {
        type: 'image/png',
      });
      user.upload(inputFile, newFile); */
    });
    test('Then the extension is ok', () => {
      /* const newbillContainer = new NewBill({document, onNavigate, store: null, localStorage: window.localStorage })
      const testHandleFile = jest.fn((e) => newbillContainer.handleChangeFile(e))
      const newInputFile = screen.getByTestId('file');
      const newFile = new File(['image'], 'test.png', {
        type: 'image/png',
      });
      newInputFile.addEventListener("change", testHandleFile)
      user.upload(newInputFile, newFile);
      const newError = screen.getByTestId('error-file')
      expect(newError.classList.contains('message-ok')).toBe(true) */
    });
    test("Then I fill the rest of the form", async () => {
      const newbillContainer = new NewBill({document, onNavigate, store: null, localStorage: window.localStorage })

      const formName = screen.getByTestId('expense-name');
      const formDate = screen.getByTestId('datepicker');
      const formAmount = screen.getByTestId('amount');
      const formVat = screen.getByTestId('vat');
      const formPct = screen.getByTestId('pct');
      const formExpense = screen.getByTestId('expense-type');
      const formBtn = screen.getByText('Envoyer')
      
      const form = screen.getByTestId('form-new-bill')
      formName.value = 'Vol Paris Toulouse';
      formAmount.value = '100';
      formVat.value = '20';
      formPct.value = '20';
      formDate.value = '2022-05-20'
      userEvent.selectOptions(formExpense, ['Transports'])
      expect(formBtn).toBeTruthy()
      expect(formDate.value).toBe('2022-05-20');

      const testHandleSubmit = jest.fn((e) => newbillContainer.handleSubmit(e))
      form.addEventListener('submit', testHandleSubmit)
      userEvent.click(formBtn);
      expect(testHandleSubmit).toHaveBeenCalled()
      /* 
      form-new-bill
      "commentary"
      button type="submit" id='btn-send-bill'
      */
    })
  })
})

// When I handle a file
  // Then the extension is wrong
  // Then the file is ok
    // Bill is create
// When I submit the form
  // Then

  // Then bill mockstore update

//When I click on logout
