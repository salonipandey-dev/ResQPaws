import * as React from "react";

export function Table(props) {
  return (
    <div className="w-full overflow-auto">
      <table {...props}>{props.children}</table>
    </div>
  );
}

export function TableHeader(props) {
  return <thead {...props}>{props.children}</thead>;
}

export function TableBody(props) {
  return <tbody {...props}>{props.children}</tbody>;
}

export function TableRow(props) {
  return <tr {...props}>{props.children}</tr>;
}

export function TableHead(props) {
  return <th {...props}>{props.children}</th>;
}

export function TableCell(props) {
  return <td {...props}>{props.children}</td>;
}

export function TableFooter(props) {
  return <tfoot {...props}>{props.children}</tfoot>;
}

export function TableCaption(props) {
  return <caption {...props}>{props.children}</caption>;
}
