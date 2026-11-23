
document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("contactForm");
  if (!form) {
    return;
  }

  var submitBtn = document.getElementById("submitBtn");
  var clearBtn = document.getElementById("clearBtn");
  var resultBox = document.getElementById("formResult");

  var fields = {
    firstName: document.getElementById("firstName"),
    lastName: document.getElementById("lastName"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    address: document.getElementById("address"),
    rating1: document.getElementById("rating1"),
    rating2: document.getElementById("rating2"),
    rating3: document.getElementById("rating3")
  };

  function checkName(value, label) {
    if (value === "") return label + " negali būti tuščias.";
    if (!/^\p{L}+$/u.test(value)) return label + " gali būti sudarytas tik iš raidžių.";
    return "";
  }

  function checkRating(value) {
    if (value === "") return "Įvertinimas negali būti tuščias.";
    var n = Number(value);
    if (isNaN(n) || n < 1 || n > 10) return "Įvertinimas turi būti nuo 1 iki 10.";
    return "";
  }

  var validators = {
    firstName: function (v) { return checkName(v, "Vardas"); },
    lastName: function (v) { return checkName(v, "Pavardė"); },
    email: function (v) {
      if (v === "") return "El. paštas negali būti tuščias.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Neteisingas el. pašto formatas (pvz. vardas@mail.to).";
      return "";
    },
    phone: function (v) {
      if (v === "") return "Telefono numeris negali būti tuščias.";
      if (!/^\+370 6\d{2} \d{5}$/.test(v)) return "Numeris turi atitikti formatą +370 6xx xxxxx.";
      return "";
    },
    address: function (v) {
      if (v === "") return "Adresas negali būti tuščias.";
      return "";
    },
    rating1: checkRating,
    rating2: checkRating,
    rating3: checkRating
  };

  function validateField(name, show) {
    var input = fields[name];
    var error = validators[name](input.value.trim());
    if (show) {
      var feedback = input.parentElement.querySelector(".invalid-feedback");
      feedback.textContent = error;
      input.classList.toggle("is-invalid", error !== "");
    }
    return error === "";
  }

  function updateSubmitState() {
    var allOk = true;
    for (var name in fields) {
      if (!validateField(name, false)) {
        allOk = false;
      }
    }
    submitBtn.disabled = !allOk;
  }

  function formatPhone(raw) {
    var digits = raw.replace(/\D/g, "");
    if (digits.indexOf("370") === 0) {
      digits = digits.slice(3);
    }
    digits = digits.slice(0, 8);
    if (digits === "") return "";
    var result = "+370 " + digits.slice(0, 3);
    if (digits.length > 3) result += " " + digits.slice(3);
    return result;
  }

  fields.phone.addEventListener("input", function () {
    fields.phone.value = formatPhone(fields.phone.value);
  });

  Object.keys(fields).forEach(function (name) {
    fields[name].addEventListener("input", function () {
      validateField(name, true);
      updateSubmitState();
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var data = {
      vardas: fields.firstName.value.trim(),
      pavarde: fields.lastName.value.trim(),
      email: fields.email.value.trim(),
      telefonas: fields.phone.value.trim(),
      adresas: fields.address.value.trim(),
      ivertinimai: [
        Number(fields.rating1.value),
        Number(fields.rating2.value),
        Number(fields.rating3.value)
      ]
    };

    console.log(data);

    var average = (data.ivertinimai[0] + data.ivertinimai[1] + data.ivertinimai[2]) / 3;
    data.vidurkis = average.toFixed(1);

    resultBox.innerHTML = "";
    var lines = [
      "Vardas: " + data.vardas,
      "Pavardė: " + data.pavarde,
      "El. paštas: " + data.email,
      "Tel. Numeris: " + data.telefonas,
      "Adresas: " + data.adresas,
      "Įvertinimai: " + data.ivertinimai.join(", "),
      data.vardas + " " + data.pavarde + ": " + data.vidurkis
    ];
    lines.forEach(function (text) {
      var p = document.createElement("p");
      p.textContent = text;
      resultBox.appendChild(p);
    });
    resultBox.classList.add("visible");
  });

  clearBtn.addEventListener("click", function () {
    form.reset();
    Object.keys(fields).forEach(function (name) {
      fields[name].classList.remove("is-invalid");
      fields[name].parentElement.querySelector(".invalid-feedback").textContent = "";
    });
    resultBox.innerHTML = "";
    resultBox.classList.remove("visible");
    updateSubmitState();
  });

  updateSubmitState();
});
