const { default: axios } = require("axios");
const { app, nativeImage, Tray, Menu } = require("electron");
const nodeCron = require("node-cron");

const translations = [
    "Standard%20Translation",
    "Certified%20Translation",
    "Sworn%20Translation",
    "Urgent%20Translation",
    "Transcription",
    "Subtitling",
    "Voice%20Over",
];

const TRANSLATION_TIME_THRESHOLD = 7; // days

const languages = ["Italian", "English"];

const requestQuote = () => {
    const translation = translations[parseInt(Math.random() * 7)];
    const selection =
        translation === "Certified%20Translation" ||
        translation === "Sworn%20Translation"
            ? ""
            : `input_radio_3=${Math.random() < 0.5 ? "Premium" : "Economy"}&`;
    const deliveryDate = new Date(
        new Date().getTime() +
            86400000 * parseInt(Math.random() * TRANSLATION_TIME_THRESHOLD)
    );
    const languageCount = languages.length;
    const sourceLanguage = languages[parseInt(Math.random() * languageCount)];
    let targetLanguage;
    do {
        targetLanguage = languages[parseInt(Math.random() * languageCount)];
    } while (sourceLanguage === targetLanguage);
    const usage = Math.random() < 0.5 ? "Private" : "Company";
    const name = "Bot";
    const email = "bot%40gmail.com";
    const description = "bene";

    axios
        .post(
            "https://www.espressotranslations.com/wp-admin/admin-ajax.php?t=1671248313852",
            {
                data: `__fluent_form_embded_post_id=450&_fluentform_18_fluentformnonce=2b6ed7855d&_wp_http_referer=%2Ftranslation-quote%2F&dropdown=${translation}&${selection}input_text_2=${sourceLanguage}&input_text_3=${targetLanguage}&input_text=${deliveryDate.getMonth()}%2F${deliveryDate.getDate()}%2F${deliveryDate.getFullYear()}&input_radio=${usage}&names%5Bfirst_name%5D=${name}&email=${email}&description=${description}`,
                action: "fluentform_submit",
                form_id: "18",
            },
            { headers: { "Content-Type": "multipart/form-data" } }
        )
        .then((response) =>
            console.log(
                response.data.success
                    ? response.data.result.message
                    : "#@$! not succeeded"
            )
        )
        .catch((error) => console.error(error));
};

app.whenReady().then(() => {
    const icon = nativeImage.createFromDataURL(
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABu0lEQVRYw+3XsYsTQRTH8Y+5REVBCCIEIWisUqayErE2QiwCRuy1FGvRv8HusLU65DhIYaFFOhsbg1dIRAlikyrm1DuR5C42E1nCRZPdi9vkwcCyO/vmy3uzv/0NKcexyUVuY7OIBzh9yLyXw0Z9q1SpZXAL1xKs2cLzbrs5hmzkwUXcw6kZL24hhzuoJgA4F3INIZOkagmq/idHJu09sALILjj/ADvYS7DmTsgTC2CIx1hPAPAFo1gA3XYTPobxX1twNrexWYqWLkF8R3/YqC8EUMXlIwJ4gfuTNswLcBLFI6r6+ejXt9KBFUB2AfFoRQUkZozxJo4QvcLdkCBpjCcasAjA/rBRP0izBSBYstu4ugxLNk/k0MCNtCzZPnbTtGQj9FPTgfA7fhsqkZoQtdBdBsAvfAt2a3pE+97FsxmiNJrxfnT8mGXJtnETxw9J/DnShoNSpfY0+IPq1DnhHR7+Y6P2ovCxDxmlSu0SnuA61sLtPTzCerfd/DlPnrW4AINe52u+UG6Fkl7AGZzAFRTzhfL7Qa/TXxpAgNjNF8qvg81qh1Z9mJR60Ot8WvY5b7ot0Zzj8Nn+NX4DJg6II2KW94AAAAAASUVORK5CYII="
    );
    const tray = new Tray(icon);

    const contextMenu = Menu.buildFromTemplate([
        {
            label: "E&xit",
            type: "normal",
            click: async () => {
                nodeCron.getTasks().forEach((task) => task.stop());
                app.quit();
            },
        },
    ]);

    tray.setToolTip("Daily Request Sender");
    tray.setContextMenu(contextMenu);

    nodeCron.schedule(`* * */1 * *`, () => {
        requestQuote();
    });
});
