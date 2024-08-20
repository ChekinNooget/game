var allTabs = [];
var tabs = [];
window.onload = function () {
  //onload so that it waits for the tab windows to load before pressing a tab
  addTabListeners();
};

//ERROR: all tab items show initailly idky why someone fixz it im going t ose lpp gbye

//THEORETICALLY, this should work for multiple tab groups. however i have not tested that,
//and the only tab group we have right now is the interface/shop
//so
//anyone reading this in the future good luck figuring that out :P (probably me)

function addTabListeners() {
  //this function initializes and adds onclick to all tab options
  allTabs = [];
  //for all tab groups (.tab-option) create an array which will have a subgroup of all tabs
  for (let i = 0; i < $(".tab-options").length; i++) {
    tabs = [];
    for (let j = 0; j < $(".tab").length; j++) {
      tabs.push($(".tab")[j]);
      tabs[j].addEventListener("click", onTabClicked.bind(this, tabs[j])); //might cause issues if this function is called multiple times, however, i dont care
    }
    allTabs.push(tabs);
  }
  //at the very start, if no tab is selected, select the very first valid (as in not hidden) one in the tab group
  for (let i = 0; i < tabs.length; i++) {
    if (window.getComputedStyle(tabs[i]).display != "none") {
      onTabClicked(tabs[i]);
      break;
    }
  }
}

//when the tab is clicked, change the selected class to the tab clicked, then handle stuff
function onTabClicked(tabDiv) {
  var par = tabDiv.parentElement;
  //hide other windows from other tabs
  for (let i = 0; i < par.children.length; i++) {
    par.children[i].classList.remove("tab-selected");
    //this line is hard coded so that each "window" for each "tab"'s id has to be its name but
    //in lowercase. for example the shop window's tab is named "shop-tab", and the id of the
    //window that appears when the shop tab is clicked has to be named "shop".
    //incredibly janky but i dont know any better way to do it
    $(`#${par.children[i].innerHTML.toLowerCase()}`).css("display", "none");
  }
  //add selected class to the clicked tab
  tabDiv.classList.add("tab-selected");
  //and then show the associated window
  $(`#${tabDiv.innerHTML.toLowerCase()}`).css("display", "block");
}

//this function is ran every tick, it checks if a tab disappears somehow
//(e.g. you leave the grocery store and no shop exists anymore)
export function updateSelectedTab() {
  //this variable tracks each tick if someone changes
  var needsChange = false;
  for (let i = 0; i < $(".tab-options").length; i++) {
    tabs = [];
    //i dont remember why this for loop is here twice, here in this function and
    //one in the add initializer function. im just going to leave it because if i
    //remove it it breaks :cate:
    for (let j = 0; j < $(".tab").length; j++) {
      tabs.push($(".tab")[j]);
      tabs[j].addEventListener("click", onTabClicked.bind(this, tabs[j]));
    }
    //if the selected tab suddenly disappears, there is a problem!1 !!
    for (let j = 0; j < tabs.length; j++) {
      if (window.getComputedStyle(tabs[j]).display == "none" && tabs[j].classList.contains("tab-selected")) {
        needsChange = true;
      }
    }
    //if there is a problem, hide the window associated with the disappearing tab,
    //and then click the first tab that exists to switch to that one.
    if (needsChange) {
      for (let j = 0; j < tabs.length; j++) {
        if (window.getComputedStyle(tabs[j]).display != "none") {
          onTabClicked(tabs[j]);
          break;
        }
      }
    }
    allTabs.push(tabs);
  }
}
//i warned you it was janky...
