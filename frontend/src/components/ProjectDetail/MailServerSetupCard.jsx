import React, { useMemo, useState } from 'react';

function Row({ label, value, copyValue }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    if (!copyValue || !navigator?.clipboard?.writeText) return;
    try {
      await navigator.clipboard.writeText(copyValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (_) {
      setCopied(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-gray-100 last:border-b-0">
      <span className="text-sm text-gray-600">{label}</span>
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-sm font-mono text-gray-900 truncate">{value}</span>
        {copyValue && (
          <button
            type="button"
            onClick={onCopy}
            className="text-xs px-2 py-1 rounded-lg bg-blue-50 text-[#004CAF] hover:bg-blue-100 transition"
          >
            {copied ? 'Zkopírováno' : 'Kopírovat'}
          </button>
        )}
      </div>
    </div>
  );
}

function ProtocolCard({ title, description, rows }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 mt-1 mb-3">{description}</p>
      {rows.map((row) => (
        <Row key={row.label} label={row.label} value={row.value} copyValue={row.copyValue} />
      ))}
    </div>
  );
}

function DnsRecord({ type, host, value, priority }) {
  const record = `${type} ${host} ${value}${priority ? ` (priority ${priority})` : ''}`;

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold px-2 py-1 rounded-md bg-white border border-gray-200">{type}</span>
        <span className="text-xs text-gray-500">Host: {host}</span>
      </div>
      <p className="text-sm text-gray-700 mt-2 break-all">{value}</p>
      {priority && <p className="text-xs text-gray-500 mt-1">Priority: {priority}</p>}
      <button
        type="button"
        onClick={() => navigator?.clipboard?.writeText?.(record)}
        className="text-xs px-2 py-1 rounded-lg bg-blue-50 text-[#004CAF] hover:bg-blue-100 transition mt-3"
      >
        Kopírovat záznam
      </button>
    </div>
  );
}

export default function MailServerSetupCard({ domain }) {
  const mailDomain = useMemo(() => (domain || '').replace(/^www\./i, '').trim(), [domain]);

  const incomingHost = `mail.${mailDomain}`;
  const outgoingHost = `smtp.${mailDomain}`;

  const dnsRecords = [
    { type: 'MX', host: '@', value: incomingHost, priority: 10 },
    { type: 'TXT', host: '@', value: `v=spf1 mx include:${outgoingHost} ~all` },
    { type: 'TXT', host: '_dmarc', value: `v=DMARC1; p=none; rua=mailto:postmaster@${mailDomain}` },
    { type: 'CNAME', host: 'autodiscover', value: incomingHost },
  ];

  return (
    <div className="bg-[#F8FBFF] rounded-2xl border border-blue-100 p-6 space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-[#004CAF]">Nastavení mailových serverů</h2>
        <p className="text-sm text-gray-600 mt-1">
          Připojte klienty (Outlook, Apple Mail, Thunderbird) pomocí níže uvedené konfigurace.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <ProtocolCard
          title="Příchozí pošta (IMAP)"
          description="Doporučeno pro synchronizaci pošty mezi více zařízeními."
          rows={[
            { label: 'Server', value: incomingHost, copyValue: incomingHost },
            { label: 'Port', value: '993', copyValue: '993' },
            { label: 'Šifrování', value: 'SSL/TLS' },
            { label: 'Přihlášení', value: 'Celá e-mailová adresa' },
          ]}
        />

        <ProtocolCard
          title="Odchozí pošta (SMTP)"
          description="Použijte pro odesílání zpráv z mailového klienta."
          rows={[
            { label: 'Server', value: outgoingHost, copyValue: outgoingHost },
            { label: 'Port', value: '587', copyValue: '587' },
            { label: 'Šifrování', value: 'STARTTLS' },
            { label: 'Autorizace', value: 'Povinná (stejné údaje jako IMAP)' },
          ]}
        />
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900">DNS záznamy pro doručování</h3>
        <p className="text-sm text-gray-500 mt-1 mb-4">
          Přidejte tyto záznamy u DNS poskytovatele domény <strong>{mailDomain}</strong>.
        </p>

        <div className="grid md:grid-cols-2 gap-3">
          {dnsRecords.map((record) => (
            <DnsRecord key={`${record.type}-${record.host}`} {...record} />
          ))}
        </div>
      </div>
    </div>
  );
}
