const fullStar = "★";
const emptyStar = "☆";

const commitFragment = `
fragment commitFragment on Repository {
  ref(qualifiedName: "master") {
    target {
      ... on Commit {
        history {
          totalCount
        }
      }
    }
  }
}
`;

const queryRepoList = `
{
  viewer {
    name
    repos: repositoriesContributedTo(first: 6, orderBy: {field: CREATED_AT, direction: DESC}) {
      totalCount
      nodes {
        name
        issues(states: OPEN) {
          totalCount
        }
        pullRequests(states: OPEN) {
          totalCount
        }
        ... commitFragment
      }
    }
  }
}
` + commitFragment;

let mutationAddStar;

let mutationRemoveStar;

function gqlRequest(query, variables, onSuccess) {
  // MAKE GRAPHQL REQUEST
  $.post({
    url: "https://api.github.com/graphql",
    headers: {
      Authorization: "bearer ..."
    },
    contentType: "application/json",
    data: JSON.stringify({
      query: query,
      variables: variables
    }),
    success: (response) => {
      if (response.errors) {
        console.log(response.errors);
      } else {
        onSuccess(response);
      }
    }
  })
}

function starHandler(element) {
  // STAR OR UNSTAR REPO BASED ON ELEMENT STATE

}

$(window).ready(function() {
  // GET NAME AND REPOSITORIES FOR VIEWER
  gqlRequest(queryRepoList, {}, (response) => {
    const viewer = response.data.viewer;
    $('header h2').text(`Hello ${viewer.name}`);

    const repos = viewer.repos;
    if (repos.totalCount > 0) {
      $("ul.repos").empty();
    }
    repos.nodes.forEach((repo) => {
      const card = `
      <h3>${repo.name}</h3>
      <p>${repo.issues.totalCount} open issues</p>
      <p>${repo.pullRequests.totalCount} open PRs</p>
      <p>${repo.ref.target.history.totalCount} commits</p>
      `;
      $("ul.repos").append(`<li><div>${card}</div></li>`);
    });
  });
});