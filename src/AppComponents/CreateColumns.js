import React, { useEffect, useState } from "react";
import { Grid, Input } from "semantic-ui-react";
import ListInputs from "./ListInputs";

const [NAMEWIDTH, SELECTORWIDTH] = [4, 12];

const CreateColumns = ({ recipe, setRecipe }) => {
  //const [columns, setColumns] = useState([{ name: "", selectors: [] }]);

  const columns = recipe.columns;

  useEffect(() => {
    const notEmpty = (column) => column.name !== "" || column.selector.length > 0;
    const newcolumns = columns.filter(notEmpty);
    newcolumns.push({ name: "", selector: [] });
    if (newcolumns.length === columns.length && !notEmpty(columns[columns.length - 1])) return;
    setRecipe((recipe) => ({ ...recipe, columns: newcolumns }));
  }, [columns, setRecipe]);

  return (
    <Grid style={{ paddingBottom: "30px" }}>
      <Grid.Row style={{ paddingBottom: "0" }}>
        <Grid.Column width={NAMEWIDTH}>
          <b>Column name</b>
        </Grid.Column>
        <Grid.Column width={SELECTORWIDTH}>
          <b>
            Column selector <span style={{ color: "grey" }}>+ optional aliases</span>
          </b>
        </Grid.Column>
      </Grid.Row>
      {columns.map((column, i) => (
        <CreateColumn
          key={"column" + i}
          i={i}
          columns={columns}
          setColumns={(value) => setRecipe((recipe) => ({ ...recipe, columns: value }))}
        />
      ))}
    </Grid>
  );
};

const CreateColumn = ({ i, columns, setColumns }) => {
  const [delayedName, setDelayedName] = useState("");

  useEffect(() => {
    setDelayedName(columns[i].name);
  }, [columns, i]);

  useEffect(() => {
    if (delayedName === columns[i].name) return;
    const timer = setTimeout(() => {
      const existingNames = columns.reduce((arr, c, j) => {
        if (i !== j) arr.push(c.name); // ignore current column
        return arr;
      }, []);
      const newColumns = [...columns];
      newColumns[i].name = safeNewName(delayedName, existingNames);
      setColumns(newColumns);
    }, 500);
    return () => clearTimeout(timer);
  }, [delayedName, i, columns, setColumns]);

  const setSelector = (value) => {
    const newColumns = [...columns];
    newColumns[i].selector = value;
    setColumns(newColumns);
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
      <Grid.Column width={SELECTORWIDTH}>
        <ListInputs values={columns[i].selector} setValues={setSelector} />
      </Grid.Column>
    </Grid.Row>
  );
};

const safeNewName = (newname, existingNames) => {
  if (newname === "") return newname;
  let safename = newname;
  for (let duplicateId = 1; duplicateId <= existingNames.length; duplicateId++) {
    if (!existingNames.includes(safename)) break;
    safename = newname + " (" + duplicateId + ")";
  }
  return safename;
};

export default CreateColumns;
