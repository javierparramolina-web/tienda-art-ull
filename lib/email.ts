import nodemailer from 'nodemailer';

console.log('[EMAIL DEBUG] Initializing transporter');

export const transporter = nodemailer.createTransport({
    host: 'smtp.resend.com',
    port: 465,
    secure: true,
    auth: {
        user: 'resend',
        pass: process.env.EMAIL_PASS,
    },
});

export const sendOrderEmails = async (orderId: string, customerEmail: string, items: string, total: number) => {
    // For Resend testing, we must send FROM the onboarding address
    // and TO the verified email (usually the owner's email during dev)
    const sender = process.env.EMAIL_FROM || 'onboarding@resend.dev';

    // In production (verified domain), we can send to customerEmail.
    // In dev (onboarding), we can ONLY send to ourselves.
    // We'll try to send to customer, but catch if it fails.
    const ownerEmail = 'javierparra.artull@gmail.com'; // Hardcoded for safety as fallback

    // Email to Owner
    await transporter.sendMail({
        from: `"Art-ULL Tienda" <${sender}>`,
        to: ownerEmail,
        subject: `🔔 Nuevo Pedido #${orderId} - ${total}€`,
        html: `
            <h1>¡Nueva Venta!</h1>
            <p>Has recibido un nuevo pedido.</p>
            <p><strong>ID:</strong> ${orderId}</p>
            <p><strong>Total:</strong> ${total}€</p>
            <p><strong>Cliente:</strong> ${customerEmail}</p>
            <h3>Artículos:</h3>
            <pre>${items}</pre>
        `,
    });

    // Email to Customer (Only works if customerEmail is verified or same as owner in Resend Sandbox)
    // We try to send it, but if it fails (likely), we just log it.
    try {
        await transporter.sendMail({
            from: `"Art-ULL" <${sender}>`,
            to: customerEmail,
            subject: `Confirmación de Pedido #${orderId} - Art-ULL`,
            html: `
                <h1>¡Gracias por tu compra!</h1>
                <p>Hemos recibido tu pedido correctamente.</p>
                <p><strong>ID de Pedido:</strong> ${orderId}</p>
                <hr />
                <h3>Resumen:</h3>
                <pre>${items}</pre>
                <p><strong>Total:</strong> ${total}€</p>
                <hr />
                <p>En breve nos pondremos en contacto contigo para el envío.</p>
                <p>Atentamente,<br/>El equipo de Art-ULL</p>
            `,
        });
    } catch (e) {
        console.warn('Could not send email to customer (Resend Sandbox Restriction?):', e);
    }
};

export const sendBizumOrderEmails = async (orderId: string, customerEmail: string, items: string, total: number) => {
    const sender = process.env.EMAIL_FROM || 'onboarding@resend.dev';
    const ownerEmail = 'javierparra.artull@gmail.com';

    // Email to Owner
    await transporter.sendMail({
        from: `"Art-ULL Tienda" <${sender}>`,
        to: ownerEmail,
        subject: `🔔 Solicitud Bizum #${orderId} - ${total}€`,
        html: `
            <h1>¡Nueva Solicitud de Bizum!</h1>
            <p>Un cliente quiere pagar por Bizum/Transferencia.</p>
            <p><strong>ID:</strong> ${orderId}</p>
            <p><strong>Total:</strong> ${total}€</p>
            <p><strong>Cliente:</strong> ${customerEmail}</p>
            <h3>Artículos:</h3>
            <pre>${items}</pre>
            <hr />
            <p><strong>Acción Requerida:</strong> Ponte en contacto con el cliente para facilitarle tu número de teléfono o IBAN.</p>
        `,
    });

    // Email to Customer
    try {
        await transporter.sendMail({
            from: `"Art-ULL" <${sender}>`,
            to: customerEmail,
            subject: `Instrucciones de Pago #${orderId} - Art-ULL`,
            html: `
                <h1>¡Gracias por tu pedido!</h1>
                <p>Hemos recibido tu solicitud de pago por Bizum o Transferencia.</p>
                <p><strong>ID de Pedido:</strong> ${orderId}</p>
                <p><strong>Total a Pagar:</strong> ${total}€</p>
                <hr />
                <h3>Siguientes Pasos:</h3>
                <p>En breve recibirás un mensaje de Javier Parra (propietario) con el número de teléfono o cuenta bancaria para realizar el ingreso.</p>
                <p>Tu pedido quedará reservado hasta que se confirme el pago.</p>
                <hr />
                <h3>Resumen:</h3>
                <pre>${items}</pre>
                <br/>
                <p>Atentamente,<br/>El equipo de Art-ULL</p>
            `,
        });
    } catch (e) {
        console.warn('Could not send email to customer (Resend Sandbox Restriction?):', e);
    }
};
