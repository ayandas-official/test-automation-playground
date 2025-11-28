import {test} from '@playwright/test'

test('Verify user can land on Forms tab', async ({page})=>{
    // Navigate to an url
    await page.goto('http://localhost:5173/');

    // Print the page title
    const pageTitle = await page.title();
    console.log(pageTitle);

    // Click on an element
    await page.locator("//a[@href='/forms']").click();

    await page.pause();
});

test.only('Verify user can fill the form', async ({browser}) => {
    const newContext = await browser.newContext();
    const page = await newContext.newPage();

    // Navigate to an url
    await page.goto('http://localhost:5173/');

    // Print the page title
    const pageTitle = await page.title();
    console.log(pageTitle);

    // Click on an element
    //await page.locator("//a[@href='/forms']").click();
    await page.getByText('Forms', {exact: true}).click();

    // Input Username
    // await page.locator("input[placeholder='Jane']").fill('')
    const usernameInput = page.locator("input[placeholder='Jane']")
    await usernameInput.fill('Ayan Das');


    await page.getByPlaceholder('jane@example.com').fill('ayan@gmail.com');
    await page.locator("select[aria-label='role']").selectOption('Viewer');

    await page.getByRole('radio', {name: 'Male', exact: true}).click();
    await page.getByRole('checkbox', {name: 'API'}).click();

    await page.pause();
})
