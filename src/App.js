import React, { useEffect, useState } from "react";
import { Grid, Segment, Menu, Dimmer, Loader } from "semantic-ui-react";
import DropZone from "./lib/DropZone/DropZone";
import RecipeTemplate from "./AppComponents/RecipeTemplate";
import DataViewer from "./AppComponents/DataViewer";
import FileDropdown from "./AppComponents/FileDropdown";
import CookbookSelector from "./AppComponents/CookbookSelector";
import "./appStyle.css";
import miseEnPlace from "./lib/recipes/miseEnPlace";
import FullDataTable from "./AppComponents/FullDataTable";

const MENU_ITEMS = ["recipes", "cookbook"];

export default function App() {
  const [menuItem, setMenuItem] = useState(MENU_ITEMS[0]);

  const render = () => {
    switch (menuItem) {
      case "recipes":
        return <Recipes />;
      case "cookbook":
        return <Cookbook />;
      default:
        return null;
    }
  };

  return (
    <div>
      <MenuBar item={menuItem} setItem={setMenuItem} />
      {render()}
    </div>
  );
}

const Recipes = () => {
  const [selected, setSelected] = useState(null);
  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const [recipe, setRecipe] = useState({});
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const file = acceptedFiles.find((af) => af.path === selected);
    if (!file) {
      setContent({});
      return;
    }
    setLoading(true);
    file
      .parse(recipe.filetype)
      .then(setContent)
      .catch((e) => console.log(e))
      .finally(() => setLoading(false));
  }, [recipe.filetype, acceptedFiles, selected]);

  return (
    <Grid columns={2} style={{ margin: "10px" }}>
      <Grid.Column width={5} style={{ overflow: "auto", height: "100vh" }}>
        <Grid.Row>
          <RecipeTemplate recipe={recipe} setRecipe={setRecipe} />
        </Grid.Row>
      </Grid.Column>
      <Grid.Column width={11} style={{ overflow: "auto", height: "100vh" }}>
        <Segment style={{ display: "flex", flexDirection: "column" }}>
          <DropZone allowedFiles={recipe.file} setAcceptedFiles={setAcceptedFiles} devmode />
          <br />
          <FileDropdown
            acceptedFiles={acceptedFiles}
            selected={selected}
            setSelected={setSelected}
          />
          <br />

          <DataViewer
            content={content}
            recipe={recipe}
            loading={loading}
            acceptedFiles={acceptedFiles}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

const Cookbook = () => {
  const [cookbook, setCookbook] = useState({});
  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const [data, setData] = useState({});
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setData({});
    setLoading(true);
    if (!cookbook?.recipes) return;
    const meps = miseEnPlace(cookbook, acceptedFiles);
    const fillData = async (meps, setData) => {
      const data = {};
      for (let mep of meps) {
        const result = await mep.cook();
        data[mep.recipe.name] = result.data;
      }
      setData(data);
      console.log(data);
      setSelected(Object.keys(data)[0]);
      setLoading(false);
    };
    fillData(meps, setData);
  }, [acceptedFiles, cookbook]);

  return (
    <Grid columns={2} style={{ margin: "10px" }}>
      <Grid.Column width={5} style={{ overflow: "auto", height: "100vh" }}>
        <Grid.Row>
          <CookbookSelector setCookbook={setCookbook} />
        </Grid.Row>
        <Grid.Row>
          <Menu vertical style={{ float: "right", marginTop: "10px" }}>
            <Dimmer active={loading}>
              <Loader />
            </Dimmer>
            {Object.keys(data).map((key) => {
              const n = data[key] ? data[key].length : 0;
              return (
                <Menu.Item key={key} active={key === selected} onClick={() => setSelected(key)}>
                  <b>{key}</b> ({n})
                </Menu.Item>
              );
            })}
          </Menu>
        </Grid.Row>
      </Grid.Column>
      <Grid.Column width={11} style={{ overflow: "auto", height: "100vh" }}>
        <Segment style={{ display: "flex", flexDirection: "column" }}>
          <Dimmer active={loading}>
            <Loader />
          </Dimmer>
          <DropZone allowedFiles={cookbook?.files} setAcceptedFiles={setAcceptedFiles} devmode />
          <br />
          <FullDataTable fullData={data[selected]} pagesize={10} />
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

const MenuBar = ({ item, setItem }) => {
  return (
    <Menu inverted>
      {MENU_ITEMS.map((i) => {
        return (
          <Menu.Item name={i} active={i === item} onClick={() => setItem(i)}>
            {i}
          </Menu.Item>
        );
      })}
    </Menu>
  );
};
