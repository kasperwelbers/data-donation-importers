import React, { useEffect, useState } from "react";
import { Grid, Input } from "semantic-ui-react";
import SelectorDropdown from "./SelectorDropdown";

const [NAMEWIDTH, PATHSWIDTH] = [6, 10];

const CreateTransformer = ({ recipe, setRecipe }) => {
  const transformers = recipe.transformers;

  useEffect(() => {
    const notEmpty = (transformer) => transformer.name !== "" || transformer.paths.length > 0;
    const newtransformers = transformers.filter(notEmpty);
    newtransformers.push({ name: "", paths: [] });
    if (
      newtransformers.length === transformers.length &&
      !notEmpty(transformers[transformers.length - 1])
    )
      return;
    setRecipe((recipe) => ({ ...recipe, transformers: newtransformers }));
  }, [transformers, setRecipe]);

  return (
    <Grid style={{ paddingBottom: "30px" }}>
      <Grid.Row style={{ paddingBottom: "0" }}>
        <Grid.Column width={NAMEWIDTH}>
          <b>Name</b>
        </Grid.Column>
        <Grid.Column width={PATHSWIDTH}>
          <b>Paths</b>
        </Grid.Column>
      </Grid.Row>
      {transformers.map((transformer, i) => (
        <CreateTransformer
          key={"transformer" + i}
          transformer={transformer}
          i={i}
          transformers={transformers}
          setTransformers={(value) => setRecipe((recipe) => ({ ...recipe, transformers: value }))}
        />
      ))}
    </Grid>
  );
};

const CreateTransformer = ({ transformer, i, transformers, setTransformers }) => {
  const [delayedName, setDelayedName] = useState("");

  useEffect(() => {
    setDelayedName(transformer.name);
  }, [transformer.name]);

  useEffect(() => {
    if (delayedName === transformer.name) return;
    const timer = setTimeout(() => {
      const existingNames = transformers.reduce((arr, c, j) => {
        if (i !== j) arr.push(c.name); // ignore current transformer
        return arr;
      }, []);
      transformers[i].name = safeNewName(delayedName, existingNames);
      console.log(transformers);
      setTransformers([...transformers]);
    }, 500);
    return () => clearTimeout(timer);
  }, [delayedName, i, transformer.name, transformers, setTransformers]);

  const setPaths = (value) => {
    transformers[i].paths = value;
    setTransformers([...transformers]);
    setTransformers(transformers);
  };

  return (
    <Grid.Row style={{ padding: "1px 0" }}>
      <Grid.Column width={NAMEWIDTH} style={{ paddingRight: "0" }}>
        <Input
          fluid
          placeholder="name"
          value={delayedName}
          onChange={(e, d) => setDelayedName(d.value)}
        />
      </Grid.Column>
      <Grid.Column width={PATHSWIDTH}>
        <SelectorDropdown values={transformer.paths} setValues={setPaths} />
      </Grid.Column>
    </Grid.Row>
  );
};

const safeNewName = (newname, existingNames) => {
  if (newname === "") return newname;
  let safename = newname;
  for (let duplicateId = 1; duplicateId <= existingNames.length; duplicateId++) {
    if (!existingNames.includes(safename)) break;
    safename = newname + duplicateId;
  }
  return safename;
};

export default CreateTransformers;
