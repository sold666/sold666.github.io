function getProjects() {
    const avatarElement = document.getElementById("avatar");
    const usernameElement = document.getElementById("username");
    const projectsHeaderElement = document.querySelector("#user-info h2");
    const progressCircle = document.getElementById("progress-circle");

    avatarElement.style.display = "none";
    usernameElement.style.display = "none";
    projectsHeaderElement.style.display = "none";
    progressCircle.style.display = "block";

    const username = "sold666";
    const userUrl = "https://api.github.com/users/" + username;

    const userPromise = new Promise(function (resolve, reject) {
        const userRequest = new XMLHttpRequest();
        userRequest.open("GET", userUrl, true);
        userRequest.onreadystatechange = function () {
            if (userRequest.readyState === 4 && userRequest.status === 200) {
                const userData = JSON.parse(userRequest.responseText);
                displayUserData(userData);
                resolve();
            } else if (userRequest.readyState === 4) {
                reject();
            }
        };
        userRequest.send();
    });

    const projectsPromise = new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest();
        const url = "https://api.github.com/users/sold666/repos";
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const projects = JSON.parse(xhr.responseText);
                displayProjects(projects);
                displayStatistic(projects);
                resolve();
            } else if (xhr.readyState === 4) {
                reject();
            }
        };
        xhr.send();
    });

    Promise.all([userPromise, projectsPromise]).then(function () {
        avatarElement.style.display = "block";
        usernameElement.style.display = "block";
        projectsHeaderElement.style.display = "block";
        progressCircle.style.opacity = 0;
        setTimeout(function () {
            progressCircle.style.display = "none";
        }, 500);
    }).catch(function () {
        console.log("Ошибка при загрузке данных");
    });
}

function displayUserData(userData) {
    const avatarURL = userData.avatar_url;
    const username = userData.login;

    const avatarImg = document.createElement("img");
    avatarImg.src = avatarURL;
    avatarImg.alt = "Avatar";
    document.getElementById("avatar").appendChild(avatarImg);

    const usernameElement = document.createElement("h2");
    usernameElement.textContent = username;
    document.getElementById("username").appendChild(usernameElement);
}


function displayProjects(projects) {
    const projectsList = document.getElementById("projects-list");
    const filterDate = new Date("2022-01-01");

    for (const element of projects) {
        const project = element;
        const projectName = project.name.toUpperCase();
        const projectURL = project.html_url;
        const projectDate = new Date(project.created_at);

        if (projectDate > filterDate) {
            const projectLink = document.createElement("a");
            projectLink.href = projectURL;
            projectLink.textContent = projectName;

            projectsList.appendChild(projectLink);
        }
    }
}

function displayStatistic(projects) {
    let languageData = fetchLanguageData(projects);
    const projectCounts = projects.length;

    const chartCanvasProjects = document.createElement("canvas");
    chartCanvasProjects.id = "projects-chart";
    document.getElementById("projects-section").appendChild(chartCanvasProjects);

    const chartCanvasLanguages = document.createElement("canvas");
    chartCanvasLanguages.id = "language-chart";
    document.getElementById("projects-section").appendChild(chartCanvasLanguages);

    const ctxProjects = chartCanvasProjects.getContext("2d");
    const ctxLanguages = chartCanvasLanguages.getContext("2d");

    new Chart(ctxProjects, {
        type: "pie",
        data: {
            labels: ["Count of projects"],
            datasets: [
                {
                    data: [projectCounts],
                    backgroundColor: ["#6ACDE0"],
                },
            ],
        },
    });

    let languageLabels = [...new Set(languageData.map(function (data) {
        return data.language;
    }).filter(function (label) {
        return label !== undefined;
    }))];

    const languageCounts = {};

    languageData.forEach(function (data) {
        const language = data.language;
        if (languageCounts[language]) {
            languageCounts[language] += 1;
        } else {
            languageCounts[language] = 1;
        }
    });

    const sortedLanguageDataCounts = Object.values(languageCounts).sort(function (a, b) {
        return b - a;
    });

    const languageDataCounts = sortedLanguageDataCounts.slice(0, 2);

    new Chart(ctxLanguages, {
        type: "pie",
        data: {
            labels: languageLabels,
            datasets: [
                {
                    data: languageDataCounts,
                    backgroundColor: ["#D0B2FA", "#9A99FB"],
                },
            ],
        },
    });
}

function fetchLanguageData(projects) {
    const languageData = [];

    projects.forEach(function (project) {
        const languagesUrl = project.languages_url;

        const languagesRequest = new XMLHttpRequest();
        languagesRequest.open("GET", languagesUrl, false);
        languagesRequest.send();

        if (languagesRequest.readyState === 4 && languagesRequest.status === 200) {
            const languages = JSON.parse(languagesRequest.responseText);
            const languageKeys = Object.keys(languages);
            const mostUsedLanguage = languageKeys.reduce(function (a, b) {
                return languages[a] > languages[b] ? a : b;
            }, languageKeys[0]);
            const languageDataItem = {
                project: project.name,
                language: mostUsedLanguage
            };
            languageData.push(languageDataItem);
        }
    });

    return languageData;
}

getProjects();
