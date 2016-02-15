#!/usr/bin/env perl
use Mojolicious::Lite;
use utf8;

use Mojo::Util qw(b64_decode);

plugin 'DefaultHelpers';

get '' => sub {
	my $c = shift;
	
	my $start = $c->param('start');
	my $liste = b64_decode $c->param('liste');
	
	my @liste = ();
	foreach my $date (split m/\n/, $liste) {
		my @date = split m/\t/, $date;
		push @liste, \@date;
	}
	
	my @months = qw(Januar Februar März April Mai Juni Juli August September Oktober November Dezember);
	my (undef, undef, undef, $Monatstag, $Monat, $Jahr, undef, undef, undef) = localtime;
	my $stand = sprintf("%2d. %s %4d", $Monatstag, $months[$Monat], $Jahr + 1900);
	
	$c->res->headers->content_disposition('attachment; filename=stegdienst.fodt;');
	$c->render(
		template => 'stegdienst',
		format => 'xml',
		start => $start,
		liste => \@liste,
		stand => $stand,
		export => "\n$start\n$liste",
	);
};

app->start;
__DATA__

@@ stegdienst.xml.ep
<?xml version="1.0" encoding="UTF-8"?>

<office:document xml:lang="de" office:version="1.2" office:mimetype="application/vnd.oasis.opendocument.text" xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:meta="urn:oasis:names:tc:opendocument:xmlns:meta:1.0" xmlns:number="urn:oasis:names:tc:opendocument:xmlns:datastyle:1.0" xmlns:style="urn:oasis:names:tc:opendocument:xmlns:style:1.0" xmlns:svg="urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0" xmlns:fo="urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0" xmlns:loext="urn:org:documentfoundation:names:experimental:office:xmlns:loext:1.0" xmlns:draw="urn:oasis:names:tc:opendocument:xmlns:drawing:1.0" xmlns:text="urn:oasis:names:tc:opendocument:xmlns:text:1.0" xmlns:table="urn:oasis:names:tc:opendocument:xmlns:table:1.0">
 <office:meta><meta:generator>SKGB-intern/1.3</meta:generator></office:meta>
 
  <office:font-face-decls>
  <style:font-face style:name="FreeSerif" svg:font-family="FreeSerif" style:font-adornments="Regular" style:font-family-generic="roman" style:font-pitch="variable"/>
 </office:font-face-decls>

 <office:styles>

  <style:default-style style:family="paragraph">
   <style:paragraph-properties fo:hyphenation-ladder-count="no-limit" style:text-autospace="ideograph-alpha" style:punctuation-wrap="hanging" style:line-break="strict" style:tab-stop-distance="1.27cm" style:writing-mode="lr-tb"/>
   <style:text-properties style:use-window-font-color="true" style:font-name="FreeSerif" fo:font-size="12pt" style:text-outline="false" fo:letter-spacing="normal" fo:font-weight="normal" style:font-pitch="variable" style:letter-kerning="true" fo:language="de" fo:country="DE" fo:hyphenation-remain-char-count="2" fo:hyphenation-push-char-count="2"/>
  </style:default-style>
  <style:style style:name="Standard" style:family="paragraph" style:class="text"><!-- "Default Style" -->
   <loext:graphic-properties draw:fill="none"/>
   <style:paragraph-properties fo:line-height="100%">
    <style:tab-stops/>
   </style:paragraph-properties>
   <style:text-properties style:font-name="FreeSerif" fo:font-family="FreeSerif" style:font-style-name="Regular" style:font-family-generic="roman" fo:hyphenate="true" fo:color="#000000"/>
  </style:style>
  
  <style:style style:name="SKGB-Titel" style:family="paragraph" style:parent-style-name="Standard">
   <style:paragraph-properties fo:text-align="center" fo:margin-bottom="0.5cm"/>
   <style:text-properties fo:font-size="15pt"/>
  </style:style>



  <style:style style:name="Emphasis" style:family="text">
   <style:text-properties fo:font-style="italic"/>
  </style:style>
  <style:style style:name="Strong_20_Emphasis" style:display-name="Strong Emphasis" style:family="text">
   <style:text-properties fo:font-weight="bold" style:font-weight-asian="bold" style:font-weight-complex="bold"/>
  </style:style>
  <style:style style:name="Underline_20_Emphasis" style:display-name="Underline Emphasis" style:family="text">
   <style:text-properties style:text-underline-style="solid" style:text-underline-width="auto" style:text-underline-color="font-color"/>
  </style:style>


  <style:style style:name="Table_20_Heading" style:display-name="Table Heading" style:family="paragraph">
   <style:paragraph-properties fo:text-align="center" style:justify-single-word="false"/>
  </style:style>
  <style:style style:name="Stegdienst-Datum" style:family="paragraph" style:parent-style-name="Standard">
   <style:paragraph-properties fo:text-align="center"/>
  </style:style>
  <style:style style:name="Text_20_body" style:display-name="Text body" style:family="paragraph" style:parent-style-name="Standard" style:class="text">
   <style:paragraph-properties fo:margin-top="0.2cm" fo:margin-bottom="0cm" />
  </style:style>
  <style:style style:name="Date-Signature" style:family="paragraph" style:parent-style-name="Text_20_body" style:class="text">
   <style:paragraph-properties fo:margin-top="0.5cm" fo:margin-bottom="0cm" />
   <style:text-properties fo:font-size="10pt"/>
  </style:style>

  <!-- hide default styles we don't use: text -->
  <style:style style:name="Numbering_20_Symbols" style:display-name="Numbering Symbols" style:family="text" style:hidden="true"/>
  <style:style style:name="Caption_20_characters" style:display-name="Caption characters" style:family="text" style:hidden="true"/>
  <style:style style:name="Definition" style:family="text" style:hidden="true"/>
  <style:style style:name="Drop_20_Caps" style:display-name="Drop Caps" style:family="text" style:hidden="true"/>
  <!--style:style style:name="Emphasis" style:family="text" style:hidden="true"/-->
  <style:style style:name="Endnote_20_anchor" style:display-name="Endnote anchor" style:family="text" style:hidden="true"/>
  <style:style style:name="Example" style:family="text" style:hidden="true"/>
  <style:style style:name="Footnote_20_anchor" style:display-name="Footnote anchor" style:family="text" style:hidden="true"/>
  <style:style style:name="Index_20_Link" style:display-name="Index Link" style:family="text" style:hidden="true"/>
  <style:style style:name="Internet_20_link" style:display-name="Internet link" style:family="text" style:hidden="true"/>
  <style:style style:name="Line_20_numbering" style:display-name="Line numbering" style:family="text" style:hidden="true"/>
  <style:style style:name="Main_20_index_20_entry" style:display-name="Main index entry" style:family="text" style:hidden="true"/>
  <style:style style:name="Bullet_20_Symbols" style:display-name="Bullet Symbols" style:family="text" style:hidden="true"/>
  <style:style style:name="Endnote_20_Symbol" style:display-name="Endnote Symbol" style:family="text" style:hidden="true"/>
  <style:style style:name="Footnote_20_Symbol" style:display-name="Footnote Symbol" style:family="text" style:hidden="true"/>
  <style:style style:name="Page_20_Number" style:display-name="Page Number" style:family="text" style:hidden="true"/>
  <style:style style:name="Placeholder" style:family="text" style:hidden="true"/>
  <style:style style:name="Citation" style:family="text" style:hidden="true"/>
  <style:style style:name="Rubies" style:family="text" style:hidden="true"/>
  <style:style style:name="Source_20_Text" style:display-name="Source Text" style:family="text" style:hidden="true"/>
  <style:style style:name="Teletype" style:family="text" style:hidden="true"/>
  <style:style style:name="User_20_Entry" style:display-name="User Entry" style:family="text" style:hidden="true"/>
  <style:style style:name="Variable" style:family="text" style:hidden="true"/>
  <style:style style:name="Vertical_20_Numbering_20_Symbols" style:display-name="Vertical Numbering Symbols" style:family="text" style:hidden="true"/>
  <style:style style:name="Visited_20_Internet_20_Link" style:display-name="Visited Internet Link" style:family="text" style:hidden="true"/>
  <!-- hide default styles we don't use: paragraphs, top level -->
  <style:style style:name="Heading" style:family="paragraph" style:hidden="true"/>
  <style:style style:name="List" style:family="paragraph" style:hidden="true"/>
  <style:style style:name="Caption" style:family="paragraph" style:hidden="true"/>
  <style:style style:name="Index" style:family="paragraph" style:hidden="true"/>
  <style:style style:name="Header" style:family="paragraph" style:hidden="true"/>
  <style:style style:name="Quotations" style:family="paragraph" style:hidden="true"/>
  <style:style style:name="Preformatted_20_Text" style:display-name="Preformatted Text" style:family="paragraph" style:hidden="true"/>
  <style:style style:name="Sender" style:family="paragraph" style:hidden="true"/>
  <style:style style:name="Signature" style:family="paragraph" style:hidden="true"/>
  <style:style style:name="Table_20_Contents" style:display-name="Table Contents" style:family="paragraph" style:hidden="true"/>
  <style:style style:name="Marginalia" style:family="paragraph" style:hidden="true" style:parent-style-name="Text_20_body"/>
  <style:style style:name="List_20_Indent" style:display-name="List Indent" style:family="paragraph" style:hidden="true"/>
  <style:style style:name="List_20_Heading" style:display-name="List Heading" style:family="paragraph" style:hidden="true"/>
  <style:style style:name="List_20_Contents" style:display-name="List Contents" style:family="paragraph" style:hidden="true"/>
  <style:style style:name="Horizontal_20_Line" style:display-name="Horizontal Line" style:family="paragraph" style:hidden="true"/>
  <style:style style:name="Header_20_right" style:display-name="Header right" style:family="paragraph" style:hidden="true"/>
  <style:style style:name="Header_20_left" style:display-name="Header left" style:family="paragraph" style:hidden="true"/>
  <style:style style:name="Frame_20_contents" style:display-name="Frame contents" style:family="paragraph" style:hidden="true"/>
  <style:style style:name="Hanging_20_indent" style:display-name="Hanging indent" style:family="paragraph" style:hidden="true"/>
  <style:style style:name="Footnote" style:family="paragraph" style:hidden="true" style:parent-style-name="Standard"/>
  <style:style style:name="Footer_20_right" style:display-name="Footer right" style:family="paragraph" style:hidden="true"/>
  <style:style style:name="First_20_line_20_indent" style:display-name="First line indent" style:family="paragraph" style:hidden="true"/>
  <style:style style:name="Footer" style:family="paragraph" style:hidden="true"/>
  <style:style style:name="Footer_20_left" style:display-name="Footer left" style:family="paragraph" style:hidden="true"/>
  <style:style style:name="Endnote" style:family="paragraph" style:hidden="true"/>
  <style:style style:name="Salutation" style:family="paragraph" style:hidden="true"/>
  <style:style style:name="Addressee" style:family="paragraph" style:hidden="true"/>
  <style:style style:name="Text_20_body_20_indent" style:display-name="Text body indent" style:family="paragraph" style:hidden="true"/>

 </office:styles>

 <office:automatic-styles>
  
  <style:style style:name="P55" style:family="paragraph" style:parent-style-name="SKGB-Titel">
   <style:paragraph-properties style:page-number="auto"/>
  </style:style>

  <style:style style:name="Table1" style:family="table">
   <style:table-properties style:width="16cm" table:align="margins" style:shadow="none"/>
  </style:style>
  <style:style style:name="Table1.A" style:family="table-column">
   <style:table-column-properties style:column-width="2.5cm"/>
  </style:style>
  <style:style style:name="Table1.B" style:family="table-column">
   <style:table-column-properties style:column-width="4.7cm" style:use-optimal-column-width="true"/>
  </style:style>
  <style:style style:name="Table1.C" style:family="table-column">
   <style:table-column-properties style:column-width="4.5cm" style:use-optimal-column-width="true"/>
  </style:style>
  <style:style style:name="Table1.D" style:family="table-column">
   <style:table-column-properties style:column-width="4.3cm"/>
  </style:style>
  <style:style style:name="Table1.A1" style:family="table-cell">
   <style:table-cell-properties fo:padding="0.02cm" fo:border-left="none" fo:border-right="none" fo:border-top="none" fo:border-bottom="0.2mm solid #000000"/>
  </style:style>
  <style:style style:name="Table1.D1" style:family="table-cell">
   <style:table-cell-properties fo:padding-left="0.47cm" fo:padding-right="0.02cm" fo:padding-top="0.02cm" fo:padding-bottom="0.02cm" fo:border="none"/>
  </style:style>
  <style:style style:name="Table1.A2" style:family="table-cell" style:data-style-name="N84">
   <style:table-cell-properties fo:padding="0.02cm" fo:border-left="0.2mm solid #000000" fo:border-right="none" fo:border-top="none" fo:border-bottom="0.2mm solid #000000"/>
  </style:style>
  <style:style style:name="Table1.B2" style:family="table-cell">
   <style:table-cell-properties fo:padding-left="0.22cm" fo:padding-right="0.02cm" fo:padding-top="0.02cm" fo:padding-bottom="0.02cm" fo:border-left="0.2mm solid #000000" fo:border-right="none" fo:border-top="none" fo:border-bottom="0.2mm solid #000000"/>
  </style:style>
  <style:style style:name="Table1.C2" style:family="table-cell">
   <style:table-cell-properties fo:padding="0.02cm" fo:border-left="none" fo:border-right="0.2mm solid #000000" fo:border-top="none" fo:border-bottom="0.2mm solid #000000"/>
  </style:style>
  
  
  <style:style style:name="P5" style:family="paragraph" style:parent-style-name="Text_20_body">
   <style:paragraph-properties fo:margin-right="0.8cm"/>
  </style:style>
  
  
  
  
  <style:style style:name="gr1" style:family="graphic">
   <style:graphic-properties style:protect="position size" style:run-through="foreground" style:wrap="run-through" style:number-wrapped-paragraphs="no-limit" style:vertical-pos="from-top" style:vertical-rel="page" style:horizontal-pos="from-left" style:horizontal-rel="page" draw:wrap-influence-on-position="once-concurrent" style:flow-with-text="false"/>
  </style:style>
  <style:style style:name="gr2" style:family="graphic">
   <style:graphic-properties draw:stroke="none" draw:fill="solid" draw:fill-color="#ffffff" draw:shadow="hidden" style:run-through="foreground"/>
  </style:style>
  <style:style style:name="gr3" style:family="graphic">
   <style:graphic-properties draw:stroke="none" draw:fill="solid" draw:fill-color="#ff3333" draw:shadow="hidden" style:run-through="foreground"/>
  </style:style>
  <style:style style:name="gr4" style:family="graphic">
   <style:graphic-properties draw:stroke="none" draw:fill="solid" draw:fill-color="#000000" draw:shadow="hidden" style:run-through="foreground"/>
  </style:style>
  
  <style:page-layout style:name="pm1">
   <style:page-layout-properties fo:page-width="21.001cm" fo:page-height="29.7cm" style:num-format="1" style:print-orientation="portrait" fo:margin-top="2cm" fo:margin-bottom="0.7cm" fo:margin-left="3cm" fo:margin-right="2cm" style:writing-mode="lr-tb" style:footnote-max-height="0cm">
    <style:footnote-sep style:width="0.018cm" style:distance-before-sep="0.101cm" style:distance-after-sep="0.101cm" style:line-style="solid" style:adjustment="left" style:rel-width="25%" style:color="#000000"/>
   </style:page-layout-properties>
   <style:header-style>
    <style:header-footer-properties fo:min-height="2.7cm" fo:margin-left="0cm" fo:margin-right="0cm" fo:margin-bottom="0.7cm" fo:background-color="transparent" style:dynamic-spacing="false" draw:fill="none"/>
   </style:header-style>
   <style:footer-style/>
  </style:page-layout>
  
  <number:date-style style:name="N84">
   <number:year number:style="long"/>
   <number:text>-</number:text>
   <number:month number:style="long"/>
   <number:text>-</number:text>
   <number:day number:style="long"/>
  </number:date-style>
 </office:automatic-styles>

 <office:master-styles>
  <style:master-page style:name="Standard" style:page-layout-name="pm1">
   <style:header>
    <text:p text:style-name="Header"/>
   </style:header>
  </style:master-page>
  <!-- hide default styles we don't use: pages -->
  <style:master-page style:name="Endnote" style:hidden="true"/>
  <style:master-page style:name="Envelope" style:hidden="true"/>
  <style:master-page style:name="First_20_Page" style:hidden="true" style:display-name="First Page"/>
  <style:master-page style:name="Footnote" style:hidden="true"/>
  <style:master-page style:name="HTML" style:hidden="true"/>
  <style:master-page style:name="Index" style:hidden="true"/>
  <style:master-page style:name="Landscape" style:hidden="true"/>
  <style:master-page style:name="Left_20_Page" style:hidden="true" style:display-name="Left Page"/>
  <style:master-page style:name="Right_20_Page" style:hidden="true" style:display-name="Right Page"/>
 </office:master-styles>










 <office:body>
  <office:text>
   <text:sequence-decls>
    <text:sequence-decl text:display-outline-level="0" text:name="Illustration"/>
    <text:sequence-decl text:display-outline-level="0" text:name="Table"/>
    <text:sequence-decl text:display-outline-level="0" text:name="Text"/>
    <text:sequence-decl text:display-outline-level="0" text:name="Drawing"/>
   </text:sequence-decls>
   <!-- SKGB-Briefkopf im Repository nicht inkludiert -->
   <text:p text:style-name="P55">Stegdienst <text:span text:style-name="T39"><%= substr $start, 0, 4 %></text:span></text:p>
   <table:table table:name="Table1" table:style-name="Table1">
    <table:table-column table:style-name="Table1.A"/>
    <table:table-column table:style-name="Table1.B"/>
    <table:table-column table:style-name="Table1.C"/>
    <table:table-column table:style-name="Table1.D"/>
    <table:table-header-rows>
     <table:table-row>
      <table:table-cell table:style-name="Table1.A1" office:value-type="string">
       <text:p text:style-name="Table_20_Heading">Datum ab</text:p>
      </table:table-cell>
      <table:table-cell table:style-name="Table1.A1" table:number-columns-spanned="2" office:value-type="string">
       <text:p text:style-name="Table_20_Heading">Stegdienst-Team</text:p>
      </table:table-cell>
      <table:covered-table-cell/>
      <table:table-cell table:style-name="Table1.D1" office:value-type="string">
       <text:p text:style-name="Standard"/>
      </table:table-cell>
     </table:table-row>
    </table:table-header-rows>
% for (my $i = 0; $i < scalar @$liste; $i++) {
    <table:table-row>
%  if ($i) {
     <table:table-cell table:style-name="Table1.A2" office:value-type="date" table:formula="&lt;A<%= $i + 1 %>&gt;+7">
%  } else {
     <table:table-cell table:style-name="Table1.A2" office:value-type="date" office:date-value="<%= $start %>">
%  }
      <text:p text:style-name="Stegdienst-Datum"/>
     </table:table-cell>
     <table:table-cell table:style-name="Table1.B2" office:value-type="string">
      <text:p text:style-name="Standard"><%= $liste->[$i]->[0] %></text:p>
     </table:table-cell>
     <table:table-cell table:style-name="Table1.C2" office:value-type="string">
      <text:p text:style-name="Standard"><%= $liste->[$i]->[1] %></text:p>
     </table:table-cell>
     <table:table-cell table:style-name="Table1.D1" office:value-type="string">
      <text:p text:style-name="Standard"/>
     </table:table-cell>
    </table:table-row>
% }
   </table:table>
   <text:p text:style-name="P5">Der Teamwechsel ist mittwochs, damit der Steg noch vor dem Wochenende gereinigt und ggf. versetzt werden kann. Die Jugendgruppe trifft sich samstags und freut sich darüber.</text:p>
   <text:p text:style-name="P5"><text:span text:style-name="Strong_20_Emphasis">Vorsicht mit dem Hochdruckreiniger</text:span> – nicht ins Wasser kippen lassen!</text:p>
   <text:p text:style-name="P5">Eintragungen im Stegbuch müssen lesbar mit Namen versehen werden. Ansonsten ist eine Berücksichtigung bei der Auswertung u. U. nicht möglich.</text:p>
   <text:p text:style-name="Date-Signature"><text:span text:style-name="Small">Stand: <%= $stand %></text:span></text:p>
  </office:text>
 </office:body>
</office:document>

<!--<%= $export %>-->
