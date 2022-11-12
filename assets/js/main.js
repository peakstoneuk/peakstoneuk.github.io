const params = new URLSearchParams(document.location.search);
const enquiry = params.get("enquiry");

if (enquiry === 'sent') {
    const enquiryForm = document.getElementById("enquiry-form");
    const successMsg = document.createElement("div");
    successMsg.innerText = 'Thanks for your enquiry. I\'ll be in touch soon!';
    successMsg.className = 'w-full p-4 mb-4 bg-green-200 border border-green-800 text-green-900';

    enquiryForm.insertBefore(successMsg, enquiryForm.firstChild);
}
