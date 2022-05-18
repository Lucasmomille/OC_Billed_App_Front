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

describe("Given I am connected as an employee", async() => {
  describe("When I am on NewBill Page", () => {
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname })
    }
    test("Then form should be displayed", async () => {
      //to-do write assertion
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
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
      const file = new File(['blob'], 'blob.pdf', {
        type: 'application/pdf',
      });
      const inputFile = screen.getByTestId('file');

      user.upload(inputFile, file);

      await waitFor(() => screen.getByTestId('error-file'))
      const error = screen.getByTestId('error-file')
      console.log('error message', document.body)
      expect(!error.classList.contains('message-ok')).toBe(true)
    });
    test("Then the extension is ok", async () => {
      const newFile = new File(['image'], 'test.png', {
        type: 'image/png',
      });
      const newInputFile = screen.getByTestId('file');

      user.upload(newInputFile, newFile);
      console.log("NEWBILL", document.body.value)
      // await waitFor(() => screen.getByTestId('error-file'))
      const error = screen.getByTestId('error-file')
      expect(error.classList.contains('message-ok')).toBe(true)
    })
    test("Then I fill the rest of the form", async () => {
      const formName = screen.getByTestId('expense-name');
      const formDate = screen.getByTestId('datepicker');
      const formAmount = screen.getByTestId('amount');
      const formVat = screen.getByTestId('vat');
      const formPct = screen.getByTestId('pct');
      const formExpense = screen.getByTestId('expense-type');
      const formBtn = screen.getByText('Envoyer')

      fireEvent.change(formName, {target: {value: 'Vol Paris Toulouse'}})
      fireEvent.change(formAmount, {target: {value: '100'}})
      fireEvent.change(formVat, {target: {value: '20'}})
      fireEvent.change(formPct, {target: {value: '20'}})
      fireEvent.change(formDate, {target: {value: '20/05/2022'}})
      userEvent.selectOptions(formExpense, ['Transports'])
      expect(formBtn).toBeTruthy()
      expect(formDate.value === '20/05/2022').toBe(true);

      const testHandleSubmit = jest.fn((e) => NewBill.handleSubmit(e))
      formBtn.addEventListener('click', testHandleSubmit())
      userEvent.click(formBtn);
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
